# Voice Transcription App - Web & Mobile Compatible

A modern, responsive voice transcription application built with React and React Native Web, featuring real-time speech-to-text conversion using OpenAI Whisper.

## 🌟 Features

### ✅ **Core Functionality**
- 🎤 **Real-time Voice Recording** with visual feedback
- 📝 **Speech-to-Text Transcription** using OpenAI Whisper
- ⏱️ **30-Second Auto-Standby** mode
- 📋 **Copy to Clipboard** functionality
- 🗂️ **Conversation Management** with local storage
- 🔄 **New Conversation** creation
- 📱 **Cross-Platform** - Works on web, mobile, and desktop

### ✅ **Web Compatibility**
- 🌐 **Progressive Web App** (PWA) ready
- 📱 **Responsive Design** for all screen sizes
- 🖥️ **Desktop Browser** support
- 📲 **Mobile Browser** support
- ⚡ **Fast Loading** with Vite bundler

### ✅ **User Experience**
- 🎨 **Modern UI** with Tailwind CSS and shadcn/ui
- 🌙 **Dark/Light Mode** support
- 🔔 **Real-time Notifications**
- 📊 **Usage Statistics**
- 💾 **Local Data Storage** (privacy-first)
- 🔒 **No Server-side Storage** required

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Python 3.8+ for the API server
- Modern web browser with microphone access

### 1. Clone the Repository
```bash
git clone https://github.com/prabodh-dev1/STT-TranscriptionApp.git
cd STT-TranscriptionApp/VoiceTranscriptionApp
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Start Development Server
```bash
pnpm run dev
```

### 4. Set Up Python API Server
```bash
cd ../whisper_api_server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python src/main.py
```

### 5. Open in Browser
Navigate to `http://localhost:5173` in your web browser.

## 📁 Project Structure

```
VoiceTranscriptionApp/
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   └── voice/                 # Custom voice components
│   │       ├── TranscriptionCard.jsx
│   │       ├── RecordingButton.jsx
│   │       ├── ConversationHistory.jsx
│   │       └── ApiConfiguration.jsx
│   ├── hooks/                     # Custom React hooks
│   │   ├── useVoiceRecording.js
│   │   ├── useConversations.js
│   │   └── useLocalStorage.js
│   ├── services/                  # API and business logic
│   │   └── TranscriptionService.js
│   ├── App.jsx                    # Main application component
│   ├── App.css                    # Global styles
│   └── main.jsx                   # Application entry point
├── whisper_api_server/            # Python Flask API server
├── public/                        # Static assets
├── package.json                   # Dependencies and scripts
└── vite.config.js                # Vite configuration
```

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **React Router** - Client-side routing
- **RecordRTC** - Cross-browser audio recording
- **Axios** - HTTP client for API communication

### Backend
- **Python Flask** - Lightweight web framework
- **OpenAI Whisper** - State-of-the-art speech recognition
- **PyTorch** - Machine learning framework
- **Flask-CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **pnpm** - Fast package manager

## 🎯 Usage Guide

### Recording Voice
1. Click the blue **"Start Recording"** button
2. Speak clearly into your microphone
3. Recording automatically stops after 30 seconds or click **"Stop"**
4. Wait for transcription to complete

### Managing Conversations
- **New Conversation**: Click the **"+"** button in the header
- **View History**: Click the **hamburger menu** (☰) in the header
- **Copy Text**: Click the **"Copy"** button on any transcription
- **Delete Conversations**: Use the **"Delete"** button in conversation history

### API Configuration
- Update the API server URL in the configuration section
- Test connection using the **"Test"** button
- Default: `http://localhost:5000/api/whisper`

## 🔧 Configuration

### API Server URL
Update the server URL in the API Configuration section:
- **Local Development**: `http://localhost:5000/api/whisper`
- **Network Access**: `http://YOUR_IP:5000/api/whisper`
- **Production**: `https://your-domain.com/api/whisper`

### Whisper Model Configuration
Edit `whisper_api_server/src/routes/whisper.py`:
```python
# Available models: tiny, base, small, medium, large
model = whisper.load_model("base", device=device)
```

### Recording Settings
Modify recording parameters in `src/services/TranscriptionService.js`:
```javascript
audio: {
  echoCancellation: true,
  noiseSuppression: true,
  sampleRate: 44100,
  channelCount: 1
}
```

## 🚀 Deployment

### Web Deployment
```bash
# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Deploy to static hosting (Netlify, Vercel, etc.)
# Upload the 'dist' folder
```

### API Server Deployment
```bash
# Install production dependencies
pip install -r requirements.txt

# Run with gunicorn (production)
gunicorn -w 4 -b 0.0.0.0:5000 src.main:app

# Or use Docker
docker build -t whisper-api .
docker run -p 5000:5000 whisper-api
```

## 📱 Mobile Support

### Progressive Web App (PWA)
- Install as app on mobile devices
- Offline capability for UI (transcription requires internet)
- Native-like experience

### React Native (Future)
The codebase is designed to be compatible with React Native for native mobile apps:
```bash
# Future React Native setup
npx react-native init VoiceTranscriptionMobile
# Copy compatible components and logic
```

## 🔒 Privacy & Security

- **Local Storage Only**: All conversations stored locally on device
- **No Cloud Storage**: Transcriptions never leave your device
- **Secure API**: HTTPS recommended for production
- **Microphone Permissions**: Explicit user consent required

## 🧪 Testing

### Manual Testing
1. Test microphone access and recording
2. Verify transcription accuracy
3. Test conversation management
4. Check responsive design on different devices
5. Validate API connectivity

### Browser Compatibility
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 🐛 Troubleshooting

### Common Issues

**Microphone Not Working**
- Check browser permissions
- Ensure HTTPS in production
- Test with different browsers

**API Connection Failed**
- Verify Python server is running
- Check firewall settings
- Confirm API URL is correct

**Poor Transcription Quality**
- Speak clearly and slowly
- Reduce background noise
- Check microphone quality
- Try different Whisper model

**Performance Issues**
- Close unnecessary browser tabs
- Check system resources
- Try smaller Whisper model

## 📊 Performance

### Metrics
- **First Load**: < 2 seconds
- **Recording Start**: < 500ms
- **Transcription**: 2-10 seconds (depends on audio length and model)
- **Bundle Size**: < 1MB gzipped

### Optimization
- Lazy loading of components
- Code splitting by routes
- Optimized asset loading
- Efficient state management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI Whisper** - Excellent speech recognition model
- **shadcn/ui** - Beautiful and accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **React Team** - Amazing frontend framework
- **Vite Team** - Lightning-fast build tool

## 📞 Support

For issues and questions:
1. Check the [troubleshooting section](#-troubleshooting)
2. Review browser console for errors
3. Ensure all dependencies are installed correctly
4. Create an issue on GitHub

---

**Made with ❤️ for seamless voice transcription**

