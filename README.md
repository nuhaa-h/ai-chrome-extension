# AI Chrome Autocomplete Extension

An AI-powered Chrome extension that provides real-time inline text completions while users type in text fields across websites. The extension communicates with an Express.js backend, which uses the OpenAI API to generate short, context-aware suggestions.

## Features

- ✨ Real-time AI autocomplete while typing
- ⌨️ Accept suggestions with the **Tab** key
- ⚡ Debounced requests to reduce latency and unnecessary API calls
- 🎯 Suggestion appears near the text cursor
- 🔄 Updates suggestion position during scrolling and window resizing
- 🚫 Escape key hides the current suggestion
- 🧠 Powered by OpenAI GPT-4.1 Mini

---

## Tech Stack

### Frontend (Chrome Extension)
- JavaScript (ES6)
- Chrome Extensions API
- HTML
- CSS

### Backend
- Node.js
- Express.js
- OpenAI API
- dotenv
- CORS

---

## Project Structure

```
ai-chrome-extension/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── manifest.json
├── background.js
├── content.js
├── popup.html
├── popup.js
├── style.css
└── icons/
```

---

## How It Works

1. The content script detects when the user types inside a supported text input.
2. After a short debounce, it sends the text before the cursor to the background script.
3. The background script forwards the request to the Express backend.
4. The backend queries the OpenAI API.
5. The generated completion is returned and displayed inline near the cursor.
6. Pressing **Tab** inserts the suggested completion into the text field.

---

## Installation

### Clone the repository

```bash
git clone https://github.com/nuhaa-h/ai-chrome-extension.git
cd ai-chrome-extension
```

### Install backend dependencies

```bash
cd backend
npm install
```

### Create a `.env` file

```env
OPENAI_API_KEY=your_api_key_here
PORT=3000
```

### Start the backend

```bash
node server.js
```

### Load the Chrome Extension

1. Open Chrome.
2. Navigate to `chrome://extensions/`.
3. Enable **Developer Mode**.
4. Click **Load unpacked**.
5. Select the project folder.

---

## Current Limitations

- Supports standard HTML `textarea` and supported `input` elements.
- Requires the backend server to be running locally.
- Does not currently support rich text editors that rely on `contenteditable` (such as Google Docs).

---

## Future Improvements

- Support contenteditable editors (Gmail, Notion, Google Docs)
- Improve caret positioning accuracy across all websites
- Add caching to reduce repeated AI requests
- Streaming suggestions for even lower latency
- User settings for suggestion length and AI model
- Authentication and cloud deployment

---

## Author

**Nuha Hammad**
