import axios from 'axios'
import RecordRTC from 'recordrtc'

export class TranscriptionService {
  constructor(apiUrl = 'http://localhost:5000/api/whisper') {
    this.apiUrl = apiUrl
    this.recorder = null
    this.stream = null
  }

  setApiUrl(url) {
    this.apiUrl = url
  }

  async checkHealth() {
    try {
      const response = await axios.get(`${this.apiUrl}/health`, { timeout: 5000 })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  async startRecording() {
    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
          channelCount: 1
        } 
      })
      
      // Create recorder
      this.recorder = new RecordRTC(this.stream, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        desiredSampRate: 16000,
        timeSlice: 1000,
        ondataavailable: (blob) => {
          // Optional: Handle real-time data if needed
        }
      })
      
      this.recorder.startRecording()
      
      return {
        success: true,
        message: 'Recording started successfully'
      }
    } catch (error) {
      console.error('Error starting recording:', error)
      return {
        success: false,
        error: error.message || 'Failed to start recording'
      }
    }
  }

  async stopRecording() {
    return new Promise((resolve) => {
      if (!this.recorder) {
        resolve({
          success: false,
          error: 'No active recording'
        })
        return
      }

      this.recorder.stopRecording(() => {
        const blob = this.recorder.getBlob()
        
        // Clean up
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop())
          this.stream = null
        }
        
        resolve({
          success: true,
          audioBlob: blob
        })
      })
    })
  }

  async transcribeAudio(audioBlob) {
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.wav')

      const response = await axios.post(`${this.apiUrl}/transcribe`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000
      })

      if (response.data.success && response.data.text) {
        return {
          success: true,
          text: response.data.text.trim(),
          segments: response.data.segments || [],
          language: response.data.language || 'unknown'
        }
      } else {
        throw new Error('No transcription received from server')
      }
    } catch (error) {
      console.error('Transcription error:', error)
      
      let errorMessage = 'Failed to transcribe audio'
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Transcription timeout. Please try with a shorter recording.'
      } else if (error.response) {
        errorMessage = `Server error: ${error.response.status} ${error.response.statusText}`
      } else if (error.request) {
        errorMessage = 'Cannot connect to transcription server. Please check if the server is running.'
      }
      
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  async recordAndTranscribe() {
    // Start recording
    const startResult = await this.startRecording()
    if (!startResult.success) {
      return startResult
    }

    // Return a promise that resolves when recording is stopped and transcribed
    return new Promise((resolve) => {
      // Store the resolve function to be called when stopping
      this._resolveRecording = resolve
    })
  }

  async finishRecordingAndTranscribe() {
    if (!this._resolveRecording) {
      return {
        success: false,
        error: 'No active recording session'
      }
    }

    // Stop recording
    const stopResult = await this.stopRecording()
    if (!stopResult.success) {
      this._resolveRecording(stopResult)
      return
    }

    // Transcribe the audio
    const transcriptionResult = await this.transcribeAudio(stopResult.audioBlob)
    
    // Resolve the original promise
    this._resolveRecording(transcriptionResult)
    this._resolveRecording = null
  }

  cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
      this.stream = null
    }
    if (this.recorder) {
      this.recorder = null
    }
  }
}

// Create a singleton instance
export const transcriptionService = new TranscriptionService()

