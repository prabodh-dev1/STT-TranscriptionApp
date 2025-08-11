import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Bars3Icon, PlusIcon } from '@heroicons/react/24/solid'
import { MicrophoneIcon } from '@heroicons/react/24/outline'

// Import custom components
import { TranscriptionCard } from './components/voice/TranscriptionCard.jsx'
import { RecordingButton } from './components/voice/RecordingButton.jsx'
import { ConversationHistory } from './components/voice/ConversationHistory.jsx'
import { ApiConfiguration } from './components/voice/ApiConfiguration.jsx'

// Import custom hooks
import { useVoiceRecording } from './hooks/useVoiceRecording.js'
import { useConversations } from './hooks/useConversations.js'
import { useAppSettings } from './hooks/useLocalStorage.js'

import './App.css'

// Main Voice Transcription Component
function VoiceTranscription() {
  const [showHistory, setShowHistory] = useState(false)
  const [notification, setNotification] = useState('')
  
  // Use custom hooks
  const { settings, updateSetting } = useAppSettings()
  const {
    conversations,
    currentConversationId,
    transcriptions,
    addTranscription,
    startNewConversation,
    loadConversation,
    deleteConversation
  } = useConversations()
  
  const {
    isRecording,
    isProcessing,
    recordTime,
    standbyMode,
    error,
    startRecording,
    stopRecording,
    testConnection
  } = useVoiceRecording(settings.apiUrl)

  const handleStartRecording = async () => {
    await startRecording()
  }

  const handleStopRecording = async () => {
    const transcription = await stopRecording()
    if (transcription) {
      addTranscription(transcription)
      if (settings.copyNotifications) {
        setNotification('Transcription completed!')
        setTimeout(() => setNotification(''), 3000)
      }
    }
  }

  const handleCopyNotification = (message) => {
    if (settings.copyNotifications) {
      setNotification(message)
      setTimeout(() => setNotification(''), 2000)
    }
  }

  const handleApiUrlChange = (newUrl) => {
    updateSetting('apiUrl', newUrl)
  }

  const handleLoadConversation = (conversation) => {
    loadConversation(conversation)
    setShowHistory(false)
  }

  if (showHistory) {
    return (
      <ConversationHistory
        conversations={conversations}
        currentConversationId={currentConversationId}
        onLoadConversation={handleLoadConversation}
        onDeleteConversation={deleteConversation}
        onBack={() => setShowHistory(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowHistory(true)}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <Bars3Icon className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Voice Transcription</h1>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={startNewConversation}
            className="text-primary-foreground hover:bg-primary-foreground/20"
            title="Start New Conversation"
          >
            <PlusIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="bg-green-500 text-white text-center py-2 px-4">
          {notification}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-500 text-white text-center py-2 px-4">
          {error}
        </div>
      )}

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Transcriptions Display */}
        <div className="min-h-[400px]">
          {transcriptions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MicrophoneIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">Ready to Record</h2>
                <p className="text-muted-foreground mb-4">
                  Tap the microphone button below to start recording your voice
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Recordings automatically stop after 30 seconds</p>
                  <p>• Your transcriptions will appear here</p>
                  <p>• All data is stored locally on your device</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {transcriptions.map((transcription) => (
                <TranscriptionCard
                  key={transcription.id}
                  transcription={transcription}
                  onCopy={handleCopyNotification}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recording Button */}
        <div className="flex justify-center py-8">
          <RecordingButton
            isRecording={isRecording}
            isProcessing={isProcessing}
            standbyMode={standbyMode}
            recordTime={recordTime}
            onStart={handleStartRecording}
            onStop={handleStopRecording}
          />
        </div>

        {/* API Configuration */}
        <ApiConfiguration
          apiUrl={settings.apiUrl}
          onApiUrlChange={handleApiUrlChange}
        />

        {/* Statistics */}
        {conversations.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{conversations.length}</div>
                  <div className="text-sm text-muted-foreground">Conversations</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {conversations.reduce((sum, conv) => sum + conv.transcriptions.length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Transcriptions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {conversations.reduce((sum, conv) => 
                      sum + conv.transcriptions.reduce((wordSum, trans) => 
                        wordSum + (trans.text?.split(' ').length || 0), 0), 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Words</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

// Settings Component
function Settings() {
  const { settings, updateSetting, resetSettings } = useAppSettings()

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Recording Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Recording Timeout (seconds)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="120"
                    value={settings.recordingTimeout}
                    onChange={(e) => updateSetting('recordingTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-input rounded-md"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showSegments"
                    checked={settings.showSegments}
                    onChange={(e) => updateSetting('showSegments', e.target.checked)}
                  />
                  <label htmlFor="showSegments" className="text-sm">
                    Show transcription segments
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="copyNotifications"
                    checked={settings.copyNotifications}
                    onChange={(e) => updateSetting('copyNotifications', e.target.checked)}
                  />
                  <label htmlFor="copyNotifications" className="text-sm">
                    Show copy notifications
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button variant="outline" onClick={resetSettings}>
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main App Component with Router
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VoiceTranscription />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  )
}

export default App

