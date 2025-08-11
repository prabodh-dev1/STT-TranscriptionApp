import { useState, useEffect, useRef, useCallback } from 'react'
import { transcriptionService } from '../services/TranscriptionService'

export function useVoiceRecording(apiUrl = 'http://localhost:5000/api/whisper') {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordTime, setRecordTime] = useState(0)
  const [standbyMode, setStandbyMode] = useState(false)
  const [error, setError] = useState(null)

  const timerRef = useRef(null)
  const standbyTimerRef = useRef(null)

  // Update API URL when it changes
  useEffect(() => {
    transcriptionService.setApiUrl(apiUrl)
  }, [apiUrl])

  // Timer for recording duration
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordTime(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
      setRecordTime(0)
    }

    return () => clearInterval(timerRef.current)
  }, [isRecording])

  // 30-second standby timer
  useEffect(() => {
    if (isRecording) {
      standbyTimerRef.current = setTimeout(() => {
        stopRecording()
        setStandbyMode(true)
      }, 30000)
    } else {
      clearTimeout(standbyTimerRef.current)
    }

    return () => clearTimeout(standbyTimerRef.current)
  }, [isRecording])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setStandbyMode(false)
      
      const result = await transcriptionService.startRecording()
      
      if (result.success) {
        setIsRecording(true)
      } else {
        setError(result.error)
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error starting recording:', error)
      setError('Error accessing microphone. Please check permissions.')
    }
  }, [])

  const stopRecording = useCallback(async () => {
    if (!isRecording) return null

    setIsRecording(false)
    setIsProcessing(true)

    try {
      const stopResult = await transcriptionService.stopRecording()
      
      if (!stopResult.success) {
        throw new Error(stopResult.error)
      }

      const transcriptionResult = await transcriptionService.transcribeAudio(stopResult.audioBlob)
      
      if (transcriptionResult.success) {
        const transcription = {
          id: Date.now().toString(),
          text: transcriptionResult.text,
          timestamp: new Date().toISOString(),
          segments: transcriptionResult.segments || [],
          language: transcriptionResult.language || 'unknown'
        }
        
        setError(null)
        return transcription
      } else {
        throw new Error(transcriptionResult.error)
      }
    } catch (error) {
      console.error('Transcription error:', error)
      setError(error.message || 'Failed to transcribe audio')
      return null
    } finally {
      setIsProcessing(false)
    }
  }, [isRecording])

  const testConnection = useCallback(async () => {
    try {
      const result = await transcriptionService.checkHealth()
      return result
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }, [])

  const cleanup = useCallback(() => {
    transcriptionService.cleanup()
    setIsRecording(false)
    setIsProcessing(false)
    setRecordTime(0)
    setStandbyMode(false)
    setError(null)
    clearInterval(timerRef.current)
    clearTimeout(standbyTimerRef.current)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  return {
    isRecording,
    isProcessing,
    recordTime,
    standbyMode,
    error,
    startRecording,
    stopRecording,
    testConnection,
    cleanup
  }
}

