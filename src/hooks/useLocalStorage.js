import { useState, useEffect, useCallback } from 'react'

export function useLocalStorage(key, initialValue) {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

// Hook for managing app settings
export function useAppSettings() {
  const [settings, setSettings, removeSettings] = useLocalStorage('voiceTranscriptionSettings', {
    apiUrl: 'http://localhost:5000/api/whisper',
    autoSave: true,
    darkMode: false,
    recordingTimeout: 30,
    language: 'auto',
    showSegments: true,
    copyNotifications: true
  })

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }, [setSettings])

  const resetSettings = useCallback(() => {
    removeSettings()
  }, [removeSettings])

  return {
    settings,
    updateSetting,
    resetSettings
  }
}

// Hook for managing user preferences
export function useUserPreferences() {
  const [preferences, setPreferences, removePreferences] = useLocalStorage('voiceTranscriptionPreferences', {
    lastUsedApiUrl: 'http://localhost:5000/api/whisper',
    preferredLanguage: 'en',
    recordingQuality: 'high',
    autoStartRecording: false,
    showTimestamps: true,
    exportFormat: 'json'
  })

  const updatePreference = useCallback((key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }, [setPreferences])

  const resetPreferences = useCallback(() => {
    removePreferences()
  }, [removePreferences])

  return {
    preferences,
    updatePreference,
    resetPreferences
  }
}

