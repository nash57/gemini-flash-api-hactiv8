# ✨ Gemini AI Chatbot

A modern, interactive chatbot application powered by Google Gemini Flash API with a beautiful responsive UI built with Tailwind CSS.

## 🎯 Features

- 💬 **Real-time Chat** - Chat with Google Gemini AI
- 🔧 **Customizable Settings** - Adjust temperature, topP, topK parameters
- 📝 **System Instructions** - Customize AI behavior with custom prompts
- 💾 **Chat History** - Persistent chat history with localStorage
- 🔑 **API Key Management** - Input API key directly from UI (stored locally)
- 📱 **Responsive Design** - Mobile-friendly interface with collapsible panels
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations
- 📤 **Export Chat** - Download chat history as JSON
- ⌨️ **Auto-sizing Textarea** - Input field grows with content

## 🛠️ Tech Stack

- **Backend**: Express.js
- **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS
- **API**: Google Gemini Flash (via @google/genai)
- **Storage**: Browser localStorage

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd gemini-flash-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get Gemini API Key**
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create or copy your API key

4. **Set up environment (optional)**
   - Create `.env` file in the root directory
   - Add: `GEMINI_API_KEY=your_api_key_here`
   - Or input the key directly in the app's Settings tab

5. **Start the server**
   ```bash
   npm start
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🚀 Usage

1. **Enter your Gemini API Key**
   - Go to Settings tab
   - Paste your API key in "Gemini API Key" field
   - Status indicator will show ✅ when key is valid

2. **Customize AI Behavior**
   - Modify "System Instruction" for custom AI behavior
   - Adjust Temperature, TopP, TopK sliders for different response styles

3. **Start Chatting**
   - Type your message in the input field (grows as you type)
   - Press `Enter` to send, or `Shift+Enter` for new line
   - View chat history in the History tab

4. **Manage Conversations**
   - Click "New Chat" to start fresh conversation
   - "Export Chat" to download as JSON
   - "Clear History" to delete all saved chats

## 📁 Project Structure

```
gemini-flash-api/
├── index.js              # Express server & API routes
├── package.json          # Dependencies
├── tailwind.config.js    # Tailwind CSS config
├── postcss.config.js     # PostCSS config
├── .env                  # Environment variables (API key)
├── .gitignore
├── README.md
└── public/
    ├── index.html        # Main HTML
    ├── script.js         # Frontend JavaScript
    ├── style.css         # Custom CSS & animations
    └── input.css         # Tailwind input
```

## 🔧 API Endpoints

### POST `/api/chat`

Send a message and get AI response.

**Request:**
```json
{
  "conversation": [
    { "role": "user", "text": "Hello" }
  ],
  "config": {
    "temperature": 0.9,
    "topP": 0.9,
    "topK": 40,
    "systemInstruction": "Jawab dalam bahasa Indonesia"
  },
  "apiKey": "optional-api-key-override"
}
```

**Response:**
```json
{
  "result": "AI response text here..."
}
```

## 🎨 Customization

### Change System Instruction Default
Edit `script.js`:
```javascript
let systemInstruction = 'Your default instruction here';
```

### Adjust Model Parameters
Edit `index.js`:
```javascript
const GEMINI_MODEL = "gemini-2.5-flash";
```

### Styling
- Edit `public/style.css` for custom CSS
- Tailwind classes in `public/index.html`

## 📊 Environment Variables

Create `.env` file:
```
GEMINI_API_KEY=your_api_key_here
```

⚠️ **Security Note**: Never commit `.env` with real API keys. Use `.gitignore` to exclude it.

## 🌍 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Features Details

### Settings Panel
- **Temperature (0-2)**: Controls randomness. Higher = more creative
- **Top P (0-1)**: Controls diversity. Lower = more focused
- **Top K (1-100)**: Consider only top K options. Higher = more diverse

### Chat History
- Auto-saved to browser localStorage
- Displays with timestamp
- Click to load previous conversation
- Export all chats as JSON

### Status Indicator
- ✅ Green: API key is set and ready
- ❌ Red: API key not configured

## 🐛 Troubleshooting

**"API Key is not set" error**
- Ensure you've entered a valid API key in Settings
- Check that the key is properly saved (status should show ✅)

**Server won't start**
- Check if port 3000 is already in use
- Run `npm install` to ensure all dependencies are installed

**Chat not responding**
- Verify your API key is valid
- Check your internet connection
- Ensure Gemini API quota not exceeded

## 📄 License

MIT License - feel free to use and modify

## 🤝 Contributing

Contributions are welcome! Feel free to fork and submit pull requests.

## 📧 Support

If you encounter any issues, please create an issue in the repository.

---

Made with ❤️ using Google Gemini Flash API
