# Deployment Guide - Whisper Voice Transcription App

This guide covers deployment scenarios for both development and production environments.

## Quick Start (Development)

### 1. Start the Python API Server

```bash
cd whisper_api_server
source venv/bin/activate
python src/main.py
```

**Note**: First startup takes 5-10 minutes to download and load the Whisper model.

### 2. Test the API Server

```bash
# Run the test script
python test_api.py

# Or manually test
curl http://localhost:5000/api/whisper/health
```

### 3. Configure React Native App

Update the API URL in `react_native_whisper_app/src/services/TranscriptionService.js`:

```javascript
// For local development
this.baseURL = 'http://localhost:5000/api/whisper';

// For physical device (replace with your computer's IP)
this.baseURL = 'http://192.168.1.100:5000/api/whisper';
```

### 4. Run React Native App

```bash
cd react_native_whisper_app
npm install
npm start

# In another terminal
npm run android  # or npm run ios
```

## Production Deployment

### Option 1: Cloud Deployment (Recommended)

#### Deploy API Server to Cloud Platform

**Heroku Deployment:**

1. Create `Procfile` in `whisper_api_server/`:
```
web: python src/main.py
```

2. Update `src/main.py` for production:
```python
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
```

3. Deploy:
```bash
heroku create your-whisper-api
heroku config:set FLASK_ENV=production
git push heroku main
```

**AWS/DigitalOcean/Google Cloud:**

1. Use Docker for containerization:

```dockerfile
# Dockerfile for whisper_api_server
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY src/ ./src/
EXPOSE 5000

CMD ["python", "src/main.py"]
```

2. Build and deploy:
```bash
docker build -t whisper-api .
docker run -p 5000:5000 whisper-api
```

#### Update React Native App for Production

1. Update API URL in `TranscriptionService.js`:
```javascript
this.baseURL = 'https://your-api-domain.com/api/whisper';
```

2. Build for production:
```bash
# Android
cd android
./gradlew assembleRelease

# iOS
cd ios
xcodebuild -workspace YourApp.xcworkspace -scheme YourApp -configuration Release
```

### Option 2: Self-Hosted Deployment

#### Server Requirements

**Minimum:**
- 4GB RAM
- 2 CPU cores
- 10GB storage
- Ubuntu 20.04+ or similar

**Recommended:**
- 8GB+ RAM
- 4+ CPU cores
- NVIDIA GPU with 4GB+ VRAM
- 50GB+ storage

#### Setup Production Server

1. **Install Dependencies:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and pip
sudo apt install python3 python3-pip python3-venv -y

# Install FFmpeg
sudo apt install ffmpeg -y

# For NVIDIA GPU support
sudo apt install nvidia-driver-470 nvidia-cuda-toolkit -y
```

2. **Deploy Application:**
```bash
# Clone or upload your code
git clone your-repo.git
cd whisper_api_server

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create systemd service
sudo nano /etc/systemd/system/whisper-api.service
```

3. **Systemd Service Configuration:**
```ini
[Unit]
Description=Whisper API Server
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/whisper_api_server
Environment=PATH=/home/ubuntu/whisper_api_server/venv/bin
ExecStart=/home/ubuntu/whisper_api_server/venv/bin/python src/main.py
Restart=always

[Install]
WantedBy=multi-user.target
```

4. **Start Service:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable whisper-api
sudo systemctl start whisper-api
```

5. **Setup Nginx Reverse Proxy:**
```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/whisper-api
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/whisper-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

6. **Setup SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

## Mobile App Distribution

### Android

1. **Generate Signed APK:**
```bash
cd android
./gradlew assembleRelease
```

2. **Upload to Google Play Store:**
   - Create developer account
   - Upload APK/AAB file
   - Complete store listing
   - Submit for review

### iOS

1. **Build for App Store:**
```bash
cd ios
xcodebuild -workspace YourApp.xcworkspace -scheme YourApp -configuration Release
```

2. **Upload to App Store:**
   - Use Xcode or Application Loader
   - Complete App Store Connect listing
   - Submit for review

## Environment Configuration

### Development Environment Variables

Create `.env` files for configuration:

**API Server (.env):**
```
FLASK_ENV=development
WHISPER_MODEL=base
MAX_FILE_SIZE=50MB
CORS_ORIGINS=*
```

**React Native (.env):**
```
API_BASE_URL=http://localhost:5000/api/whisper
ENVIRONMENT=development
```

### Production Environment Variables

**API Server:**
```
FLASK_ENV=production
WHISPER_MODEL=base
MAX_FILE_SIZE=50MB
CORS_ORIGINS=https://your-app-domain.com
SECRET_KEY=your-secret-key
```

## Monitoring and Maintenance

### Health Monitoring

1. **API Health Check:**
```bash
curl https://your-api-domain.com/api/whisper/health
```

2. **Server Monitoring:**
```bash
# Check service status
sudo systemctl status whisper-api

# View logs
sudo journalctl -u whisper-api -f

# Monitor resources
htop
nvidia-smi  # For GPU monitoring
```

### Backup and Updates

1. **Backup Strategy:**
   - Regular code backups
   - Database backups (if using)
   - Configuration backups

2. **Update Process:**
```bash
# Stop service
sudo systemctl stop whisper-api

# Update code
git pull origin main

# Update dependencies
source venv/bin/activate
pip install -r requirements.txt

# Restart service
sudo systemctl start whisper-api
```

## Troubleshooting

### Common Issues

1. **Server Won't Start:**
   - Check Python version compatibility
   - Verify all dependencies installed
   - Check port availability
   - Review error logs

2. **Model Loading Issues:**
   - Ensure sufficient RAM/VRAM
   - Check internet connection for model download
   - Verify disk space

3. **Mobile App Connection Issues:**
   - Verify API URL configuration
   - Check network connectivity
   - Ensure CORS is properly configured
   - Test with curl/Postman first

4. **Performance Issues:**
   - Monitor CPU/GPU usage
   - Consider using smaller Whisper model
   - Implement request queuing for high load
   - Add caching if appropriate

### Performance Optimization

1. **API Server:**
   - Use GPU acceleration when available
   - Implement request queuing
   - Add response caching
   - Use smaller models for faster processing

2. **Mobile App:**
   - Implement audio compression
   - Add offline capability
   - Optimize UI rendering
   - Implement proper error handling

## Security Considerations

1. **API Security:**
   - Implement authentication if needed
   - Use HTTPS in production
   - Validate file uploads
   - Implement rate limiting

2. **Mobile App:**
   - Secure API communication
   - Validate user inputs
   - Implement proper error handling
   - Follow platform security guidelines

## Support and Maintenance

### Regular Maintenance Tasks

1. **Weekly:**
   - Check server health
   - Review error logs
   - Monitor resource usage

2. **Monthly:**
   - Update dependencies
   - Review security patches
   - Backup configurations

3. **Quarterly:**
   - Performance review
   - Security audit
   - Update documentation

For additional support, refer to the main README.md file or check the project documentation.

