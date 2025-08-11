# STT Transcription App

A complete React Native + Python Flask voice transcription application using OpenAI Whisper.

## 🎯 Overview

This repository contains a full-stack voice transcription solution with:
- **React Native Mobile App**: Cross-platform (iOS/Android) voice recording and transcription
- **Python Flask API**: Backend server with OpenAI Whisper integration
- **Real-time Processing**: Live voice-to-text transcription
- **Local Storage**: Conversation history saved on device

## 📁 Project Structure

```
STT-TranscriptionApp/
├── react_native_whisper_app/    # React Native mobile application
│   ├── src/                     # Source code
│   ├── android/                 # Android-specific files
│   ├── ios/                     # iOS-specific files
│   └── package.json             # Dependencies and scripts
├── whisper_api_server/          # Python Flask API server
│   ├── src/                     # Source code
│   ├── requirements.txt         # Python dependencies
│   └── test_api.py             # API testing script
├── PROJECT_OVERVIEW.md          # Detailed project documentation
├── DEPLOYMENT_GUIDE.md          # Deployment instructions
└── README.md                    # This file
```

## 🚀 Quick Start

### 1. Start the API Server
```bash
cd whisper_api_server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python src/main.py
```

### 2. Run the Mobile App
```bash
cd react_native_whisper_app
npm install
npm start

# In another terminal
npm run android  # or npm run ios
```

## ✨ Features

- 🎤 **Voice Recording**: Tap-to-record with visual feedback
- 📝 **Real-time Transcription**: Live speech-to-text using OpenAI Whisper
- 📱 **Cross-Platform**: Works on both Android and iOS
- ⏱️ **Auto-Standby**: 30-second automatic pause
- 📋 **Copy to Clipboard**: Easy text copying
- 🗂️ **Conversation History**: Local storage with hamburger menu access
- 🔄 **New Conversations**: Start fresh anytime
- 🔒 **Privacy-First**: All data stored locally on device

## 🛠️ Technology Stack

### Frontend (React Native)
- React Native 0.72+
- React Navigation 6
- AsyncStorage for local data
- React Native Audio Recorder Player
- React Native Permissions

### Backend (Python)
- Flask web framework
- OpenAI Whisper for speech recognition
- PyTorch with CUDA/MPS support
- Flask-CORS for cross-origin requests

## 📖 Documentation

- **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)**: Complete project architecture and features
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**: Detailed deployment instructions
- **[React Native README](react_native_whisper_app/README.md)**: Mobile app specific documentation

## 🔧 Configuration

### API Server URL
Update the server URL in `react_native_whisper_app/src/services/TranscriptionService.js`:

```javascript
// For local development
this.baseURL = 'http://localhost:5000/api/whisper';

// For physical device (replace with your computer's IP)
this.baseURL = 'http://192.168.1.100:5000/api/whisper';
```

### Whisper Model
Configure the model in `whisper_api_server/src/routes/whisper.py`:

```python
# Available: tiny, base, small, medium, large
model = whisper.load_model("base", device=device)
```

## 🚀 Deployment

### Development
- Local server with React Native development environment
- Hot reloading for rapid development

### Production
- **Cloud**: Heroku, AWS, Google Cloud, DigitalOcean
- **Self-hosted**: Ubuntu server with Nginx
- **Mobile**: Google Play Store and Apple App Store

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🔒 Permissions

### Android
- `RECORD_AUDIO`: Voice recording
- `WRITE_EXTERNAL_STORAGE`: Audio file storage
- `INTERNET`: API communication

### iOS
- `NSMicrophoneUsageDescription`: Microphone access for recording

## 🧪 Testing

### API Server
```bash
cd whisper_api_server
python test_api.py
```

### Manual Testing
```bash
curl http://localhost:5000/api/whisper/health
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions:
1. Check the [troubleshooting section](DEPLOYMENT_GUIDE.md#troubleshooting)
2. Review server and app logs
3. Ensure all dependencies are properly installed

## 🎉 Acknowledgments

- OpenAI Whisper for speech recognition
- React Native community for mobile framework
- Flask community for web framework

