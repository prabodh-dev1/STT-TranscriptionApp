import RNFS from 'react-native-fs';

class TranscriptionService {
  constructor() {
    // Configure API base URL - update this to match your server
    this.baseURL = 'http://localhost:5000/api/whisper';
    
    // For development, you might need to use your computer's IP address
    // this.baseURL = 'http://192.168.1.100:5000/api/whisper';
  }

  async transcribeAudio(audioFilePath) {
    try {
      // Check if file exists
      const fileExists = await RNFS.exists(audioFilePath);
      if (!fileExists) {
        throw new Error('Audio file not found');
      }

      // Get file info
      const fileInfo = await RNFS.stat(audioFilePath);
      console.log('Audio file info:', fileInfo);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('audio', {
        uri: `file://${audioFilePath}`,
        type: 'audio/mp3', // or appropriate MIME type
        name: 'recording.mp3',
      });

      // Make API request
      const response = await fetch(`${this.baseURL}/transcribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Transcription failed');
      }

      return result;

    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  }

  async checkHealth() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }

  async getAvailableModels() {
    try {
      const response = await fetch(`${this.baseURL}/models`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Get models error:', error);
      throw error;
    }
  }

  // Utility method to test connection
  async testConnection() {
    try {
      const health = await this.checkHealth();
      console.log('Server health:', health);
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // Method to update base URL (useful for configuration)
  updateBaseURL(newURL) {
    this.baseURL = newURL;
  }
}

export default new TranscriptionService();

