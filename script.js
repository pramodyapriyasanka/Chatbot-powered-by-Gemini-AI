const suggestions = document.querySelector(".suggestions");
const chatsContainer = document.querySelector(".chats-container");
const appHeader = document.querySelector(".app-header");
const promptForm = document.querySelector(".prompt-form");
const promptInput = promptForm.querySelector(".prompt-input");
const stopBtn = document.getElementById("stop-response-btn");
const clearBtn = document.getElementById("delete-chats-btn");


const API_KEY = "AIzaSyBBKfhEbxxVVRgQJFANQGjfKhrT653GpMk";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

let userMessage = "";
const chatHistory = [];

let stopTyping = false;
let typingTimeout;

const scrollToBottom = () => {
  chatsContainer.scrollTop = chatsContainer.scrollHeight;
};

const typeText = (element, text, delay = 5) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = text;
  const nodes = Array.from(tempDiv.childNodes);
  let i = 0;

  stopTyping = false;
  stopBtn.style.display = "inline-block";

  const typeNode = (node, parent, callback) => {
    if (stopTyping) {
      stopBtn.style.display = "none";
      return;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      const chars = node.textContent.split("");
      let idx = 0;

      const typeChar = () => {
        if (stopTyping) {
          stopBtn.style.display = "none";
          return;
        }

        if (idx >= chars.length) {
          callback();
          return;
        }

        parent.append(chars[idx++]);
        scrollToBottom();
        typingTimeout = setTimeout(typeChar, delay);
      };

      typeChar();
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const clone = node.cloneNode(false);
      parent.appendChild(clone);
      const children = Array.from(node.childNodes);
      let childIndex = 0;

      const typeNextChild = () => {
        if (stopTyping) {
          stopBtn.style.display = "none";
          return;
        }

        if (childIndex >= children.length) {
          callback();
          return;
        }

        typeNode(children[childIndex++], clone, typeNextChild);
      };

      typeNextChild();
    }
  };

  const typeNext = () => {
    if (stopTyping || i >= nodes.length) {
      stopBtn.style.display = "none";
      return;
    }
    typeNode(nodes[i++], element, typeNext);
  };

  typeNext();
};

stopBtn.addEventListener("click", () => {
  stopTyping = true;
  clearTimeout(typingTimeout);
  stopBtn.style.display = "none";
});

const createMsgElement = (content, isHTML = false, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);

  const p = document.createElement("p");
  p.classList.add("message-text");

  if (isHTML) {
    p.innerHTML = content;
  } else {
    p.textContent = content;
  }

  div.appendChild(p);
  return div;
};

const isImportantReply = (text) => {
  const keywords = ["important", "alert", "warning", "critical", "urgent"];
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword));
};

function normalizeStars(text) {
  return text
    .split('\n')
    .map(line => {
      const match = line.match(/^(\*+)\s*(.*)$/);
      if (match) {
        const cleaned = match[2].replace(/\*\*/g, '').trim();
        return '* ' + cleaned;
      }
      return line;
    })
    .join('\n');
}

function formatBotReply(text) {
  const lines = text.split('\n').map(line => {
    const starMatch = line.match(/^(\*+)\s*(.*)$/);
    if (starMatch) {
      const cleaned = starMatch[2].replace(/\*\*/g, '').trim();
      return '* ' + cleaned;
    }
    return line;
  });

  let inList = false;
  let formatted = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('* ')) {
      if (!inList) {
        formatted += '<ul>';
        inList = true;
      }
      formatted += `<li>${line.slice(2)}</li>`;
    } else {
      if (inList) {
        formatted += '</ul>';
        inList = false;
      }
      formatted += line.replace(/[&<>"']/g, c =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
      );
      if (i < lines.length - 1) formatted += '<br>';
    }
  }

  if (inList) {
    formatted += '</ul>';
  }

  return formatted;
}

const generateTextResponse = async (botMsgDiv) => {
  const textElement = botMsgDiv.querySelector(".message-text");

  chatHistory.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: chatHistory }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply.";
    textElement.innerHTML = "";
    botMsgDiv.classList.remove("loading");

    if (isImportantReply(responseText)) {
      botMsgDiv.classList.add("important");
    }

    const formattedReply = formatBotReply(responseText);
    typeText(textElement, formattedReply);
  } catch (error) {
    textElement.textContent = `⚠️ ${error.message}`;
    botMsgDiv.classList.remove("loading");
    stopBtn.style.display = "none";
  }
};

let chatStarted = false;

const handleFormSubmit = (e) => {
  e.preventDefault();
  userMessage = promptInput.value.trim();
  userMessage = normalizeStars(userMessage);

  if (!userMessage) return;

  if (!chatStarted) {
    suggestions.style.display = "none";
    chatsContainer.style.display = "flex";
    const heading = appHeader.querySelector("h1");
    const subHeading = appHeader.querySelector("h2");
    if (heading) heading.style.display = "none";
    if (subHeading) subHeading.style.display = "none";
    chatStarted = true;
  }

  const userMsgDiv = createMsgElement(userMessage, false, "user-message");
  chatsContainer.appendChild(userMsgDiv);
  promptInput.value = "";
  scrollToBottom();

  const botHTML = `<img src="gemini-chatbot-logo.svg" class="avatar" /> <p class="message-text">Just a sec..</p>`;
  const botMsgDiv = document.createElement("div");
  botMsgDiv.classList.add("message", "bot-message", "loading");
  botMsgDiv.innerHTML = botHTML;
  chatsContainer.appendChild(botMsgDiv);
  botMsgDiv.scrollIntoView({ behavior: "smooth", block: "start" });

  generateTextResponse(botMsgDiv);
};

window.addEventListener("DOMContentLoaded", () => {
  appHeader.style.display = "block";
  suggestions.style.display = "flex";
  chatsContainer.style.display = "none";
});

promptForm.addEventListener("submit", handleFormSubmit);

console.log("clearBtn:", clearBtn);  // This should print the button element

clearBtn.addEventListener("click", () => {
  const confirmed = window.confirm("Start a new chat? This will clear your current chat.");

  if (!confirmed) {
    // User canceled, do nothing
    return;
  }

  // User confirmed, clear chat as before
  const messages = chatsContainer.querySelectorAll(".message:not(.initial-message)");
  messages.forEach(msg => msg.remove());

  chatHistory.length = 0;
  chatStarted = false;
  promptInput.value = "";

  suggestions.style.display = "none";
  chatsContainer.style.display = "flex";

  appHeader.querySelector("h1").style.display = "none";
  appHeader.querySelector("h2").style.display = "none";

  scrollToBottom();
});


//toggle Dark and Light mode

const themeToggleBtn = document.querySelector("button[type='theme-toggle-btn']");

const setTheme = (theme) => {
  if (theme === "dark") {
    document.body.classList.add("dark-theme");
    themeToggleBtn.textContent = "light_mode";
  } else {
    document.body.classList.remove("dark-theme");
    themeToggleBtn.textContent = "dark_mode";
  }
  localStorage.setItem("theme", theme);
};

// Default dark theme if no saved theme in localStorage
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  setTheme(savedTheme ? savedTheme : "dark");
});

themeToggleBtn.addEventListener("click", () => {
  const currentTheme = document.body.classList.contains("dark-theme") ? "dark" : "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);
});

