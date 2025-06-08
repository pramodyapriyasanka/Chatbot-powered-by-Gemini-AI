# Chatbot-powered-by-Gemini-AI
A smart, AI-powered chatbot built using Gemini AI technology to provide interactive and intelligent conversational experiences.
# Chatbot-powered-by-Gemini-AI

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Chatbot](#running-the-chatbot)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Theming (Light/Dark Mode)](#theming-lightdark-mode)
- [Security Policy](#security-policy)
- [Contributing](#contributing)
- [License](#license)

## Features

* **AI-Powered Conversations**: Leverages Google's Gemini AI to generate human-like responses.
* **Interactive Chat Interface**: A user-friendly interface for seamless communication.
* **Real-time Typing Indicator**: Provides a visual cue when the bot is generating a response.
* **Chat History**: Maintains a history of the conversation for context.
* **Stop Response**: Allows users to stop the bot's response generation mid-way.
* **Clear Chat**: Option to clear the current chat and start a new conversation.
* **Responsive Design**: Optimized for various screen sizes, from desktops to mobile devices.
* **Theming**: Supports both light and dark modes for user preference.
* **Input Suggestions**: Provides initial conversation prompts.
* **Dynamic UI**: Adjusts UI elements based on chat activity (e.g., hiding suggestions after chat starts).
* **Secure API Key Handling**: API key is managed within the `script.js` file for direct use (Note: For production, consider server-side handling).

## Demo

![image](https://github.com/user-attachments/assets/18074c17-0be8-4401-a31c-61b78be8d109)
![image](https://github.com/user-attachments/assets/258b704b-abef-45cb-b92d-7212a09cea94)
![image](https://github.com/user-attachments/assets/5ff23444-033a-4c18-9071-fcdf60f30714)




## Getting Started

Follow these instructions to set up and run the chatbot on your local machine.

### Prerequisites

* Web browser (e.g., Chrome, Firefox, Edge)
* A Google API Key with access to Gemini API. You can obtain one from the Google AI Studio.
* Node.js and npm (or yarn) if you plan to use `live-server` for local development.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/your-username/Chatbot-powered-by-Gemini-AI.git](https://github.com/your-username/Chatbot-powered-by-Gemini-AI.git)
    cd Chatbot-powered-by-Gemini-AI
    ```

2.  **Set up your Gemini API Key:**

    Open `script.js` and replace `"YOUR_API_KEY"` with your actual Google Gemini API key:

    ```javascript
    const API_KEY = "AIzaSyBBKfhEbxxVVRgQJFANQGjfKhrT653GpMk"; // Replace with your actual API key
    ```

    **Note**: The provided `script.js` already contains a placeholder API key (`AIzaSyBBKfhEbxxVVRgQJFANQGjfKhrT653GpMk`). **This key is for demonstration purposes only and should be replaced with your own key for actual use.**

### Running the Chatbot

You can run the chatbot by simply opening the `index.html` file in your web browser, or by using a local development server.

#### Option 1: Opening `index.html` directly

Navigate to the project directory and double-click `index.html` to open it in your default web browser.

#### Option 2: Using `live-server` (Recommended for development)

`live-server` provides a local development server with live reloading, which is useful for making changes and seeing them reflected instantly.

1.  **Install `live-server` globally (if you haven't already):**

    ```bash
    npm install -g live-server
    ```

2.  **Start the server:**

    In the project's root directory, run:

    ```bash
    live-server
    ```

    By default, `live-server` will open the project in your browser at `http://127.0.0.1:8080` (or another available port). The `settings.json` file in this repository suggests `5501` as the preferred port, so it might open at `http://127.0.0.1:5501`.

## Project Structure
Chatbot-powered-by-Gemini-AI/
├── index.html              # Main HTML file
├── style.css               # CSS for styling the chatbot
├── script.js               # JavaScript for chatbot logic and Gemini API integration
├── README.md               # Project README file
├── SECURITY.md             # Security policy document
├── gemini-chatbot-logo.svg # Gemini chatbot avatar
└── settings.json           # VS Code Live Server settings (optional)
