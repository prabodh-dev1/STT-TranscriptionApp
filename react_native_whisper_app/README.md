# Whisper Voice Transcription App

A React Native application for real-time voice transcription using OpenAI Whisper, with a Python Flask API backend.

## Features

- 🎤 Real-time voice recording and transcription
- 📝 Conversation management with local storage
- 📋 Copy to clipboard functionality
- ⏱️ 30-second auto-standby mode
- 📱 Cross-platform (iOS and Android)
- 🗂️ Conversation history with hamburger menu
- 🔄 New conversation functionality

## Architecture

- **Frontend**: React Native app with navigation, audio recording, and local storage
- **Backend**: Python Flask API server with OpenAI Whisper integration
- **Communication**: RESTful API with multipart file upload for audio

## Prerequisites

### For React Native App
- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Physical device or emulator

### For Python API Server
- Python 3.8+
- NVIDIA GPU with CUDA support (recommended) or Apple Silicon Mac with MPS
- FFmpeg (for audio processing)

## Setup Instructions

### 1. Python API Server Setup

```bash
# Navigate to the server directory
cd whisper_api_server

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python src/main.py
```

The server will start on `http://localhost:5000`

#### API Endpoints
- `GET /api/whisper/health` - Health check
- `POST /api/whisper/transcribe` - Transcribe audio file
- `GET /api/whisper/models` - Get available models

### 2. React Native App Setup

```bash
# Navigate to the app directory
cd react_native_whisper_app

# Install dependencies
npm install

# For iOS (macOS only)
cd ios && pod install && cd ..

# Start Metro bundler
npm start
```

#### Running on Android
```bash
# Make sure Android emulator is running or device is connected
npm run android
```

#### Running on iOS
```bash
# Make sure iOS simulator is running or device is connected
npm run ios
```

## Configuration

### API Server Configuration

Update the server URL in the React Native app:

1. Open `src/services/TranscriptionService.js`
2. Update the `baseURL` to match your server:

```javascript
// For local development
this.baseURL = 'http://localhost:5000/api/whisper';

// For development with physical device (replace with your computer's IP)
this.baseURL = 'http://192.168.1.100:5000/api/whisper';

// For production deployment
this.baseURL = 'https://your-server-domain.com/api/whisper';
```

### Whisper Model Configuration

The API server uses the "base" model by default. To change the model:

1. Open `whisper_api_server/src/routes/whisper.py`
2. Modify the model loading line:

```python
# Available models: tiny, base, small, medium, large
model = whisper.load_model("base", device=device)
```

## Permissions

### Android
The app requires the following permissions (automatically handled):
- `RECORD_AUDIO` - For voice recording
- `WRITE_EXTERNAL_STORAGE` - For saving audio files
- `INTERNET` - For API communication

### iOS
The app requires microphone permission with the usage description:
"This app needs access to microphone to record audio for voice transcription."

## Usage

1. **Start Recording**: Tap the blue microphone button to start recording
2. **Stop Recording**: Tap the red microphone button to stop recording
3. **Auto-Standby**: After 30 seconds of recording, the app enters standby mode
4. **Continue Recording**: In standby mode, tap the orange button to continue
5. **Copy Text**: Tap the clipboard icon or long-press on transcription text
6. **New Conversation**: Tap "New" in the header to start a fresh conversation
7. **View History**: Use the hamburger menu to access conversation history

## Troubleshooting

### Common Issues

1. **Server Connection Failed**
   - Ensure the Python server is running
   - Check the API URL in TranscriptionService.js
   - For physical devices, use your computer's IP address

2. **Audio Recording Not Working**
   - Check microphone permissions
   - Ensure device has a working microphone
   - Try restarting the app

3. **Transcription Errors**
   - Check server logs for errors
   - Ensure Whisper model is properly loaded
   - Verify audio file format compatibility

4. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - For iOS: run `cd ios && pod install`
   - Clear Metro cache: `npx react-native start --reset-cache`

### Performance Optimization

1. **GPU Acceleration**: Ensure CUDA is properly installed for NVIDIA GPUs
2. **Model Selection**: Use smaller models (tiny, base) for faster processing
3. **Audio Quality**: Higher quality audio improves transcription accuracy

## Development

### Project Structure

```
react_native_whisper_app/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Screen components
│   ├── services/           # API services
│   ├── context/            # React context providers
│   ├── navigation/         # Navigation configuration
│   └── utils/              # Utility functions
├── android/                # Android-specific files
├── ios/                    # iOS-specific files
└── package.json

whisper_api_server/
├── src/
│   ├── routes/             # API route handlers
│   ├── models/             # Database models
│   └── main.py             # Flask app entry point
└── requirements.txt
```

### Adding New Features

1. **New API Endpoints**: Add routes in `whisper_api_server/src/routes/`
2. **New Screens**: Add components in `src/screens/`
3. **New Services**: Add API clients in `src/services/`

## Deployment

### Production Deployment

1. **API Server**: Deploy using services like Heroku, AWS, or DigitalOcean
2. **React Native App**: Build and distribute through App Store/Google Play

### Environment Variables

For production, set these environment variables:
- `FLASK_ENV=production`
- `API_BASE_URL=https://your-api-domain.com`

## License

This project is licensed under the ISC License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review server and app logs
3. Ensure all dependencies are properly installed

