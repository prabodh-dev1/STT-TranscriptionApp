import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'voiceTranscriptionConversations'

export function useConversations() {
  const [conversations, setConversations] = useState([])
  const [currentConversationId, setCurrentConversationId] = useState(null)
  const [transcriptions, setTranscriptions] = useState([])

  // Load conversations from localStorage on mount
  useEffect(() => {
    try {
      const savedConversations = localStorage.getItem(STORAGE_KEY)
      if (savedConversations) {
        const parsed = JSON.parse(savedConversations)
        setConversations(parsed)
        
        // Load the most recent conversation
        if (parsed.length > 0) {
          const latest = parsed[0]
          setCurrentConversationId(latest.id)
          setTranscriptions(latest.transcriptions || [])
        }
      }
    } catch (error) {
      console.error('Error loading conversations from localStorage:', error)
    }
  }, [])

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
      } catch (error) {
        console.error('Error saving conversations to localStorage:', error)
      }
    }
  }, [conversations])

  const addTranscription = useCallback((transcription) => {
    setTranscriptions(prev => [...prev, transcription])
    
    // Generate conversation title from first transcription
    const conversationTitle = transcription.text.length > 50 
      ? transcription.text.substring(0, 50) + '...'
      : transcription.text

    setConversations(prev => {
      const existing = prev.find(conv => conv.id === currentConversationId)
      
      if (existing) {
        // Update existing conversation
        return prev.map(conv => 
          conv.id === currentConversationId 
            ? { 
                ...conv, 
                transcriptions: [...conv.transcriptions, transcription], 
                updatedAt: new Date().toISOString(),
                title: conv.transcriptions.length === 0 ? conversationTitle : conv.title
              }
            : conv
        )
      } else {
        // Create new conversation
        const newConversation = {
          id: Date.now().toString(),
          title: conversationTitle,
          transcriptions: [transcription],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setCurrentConversationId(newConversation.id)
        return [newConversation, ...prev]
      }
    })
  }, [currentConversationId])

  const startNewConversation = useCallback(() => {
    setTranscriptions([])
    setCurrentConversationId(null)
  }, [])

  const loadConversation = useCallback((conversation) => {
    setCurrentConversationId(conversation.id)
    setTranscriptions(conversation.transcriptions || [])
  }, [])

  const deleteConversation = useCallback((conversationId) => {
    setConversations(prev => {
      const filtered = prev.filter(conv => conv.id !== conversationId)
      
      // If we deleted the current conversation, start a new one
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null)
        setTranscriptions([])
      }
      
      return filtered
    })
  }, [currentConversationId])

  const updateConversationTitle = useCallback((conversationId, newTitle) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, title: newTitle, updatedAt: new Date().toISOString() }
          : conv
      )
    )
  }, [])

  const clearAllConversations = useCallback(() => {
    setConversations([])
    setCurrentConversationId(null)
    setTranscriptions([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const exportConversations = useCallback(() => {
    const dataStr = JSON.stringify(conversations, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `voice-transcriptions-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }, [conversations])

  const importConversations = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result)
          
          if (Array.isArray(imported)) {
            setConversations(prev => [...imported, ...prev])
            resolve(imported.length)
          } else {
            reject(new Error('Invalid file format'))
          }
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }, [])

  const getCurrentConversation = useCallback(() => {
    return conversations.find(conv => conv.id === currentConversationId) || null
  }, [conversations, currentConversationId])

  const getConversationStats = useCallback(() => {
    const totalConversations = conversations.length
    const totalTranscriptions = conversations.reduce((sum, conv) => sum + conv.transcriptions.length, 0)
    const totalWords = conversations.reduce((sum, conv) => 
      sum + conv.transcriptions.reduce((wordSum, trans) => 
        wordSum + (trans.text?.split(' ').length || 0), 0), 0)
    
    return {
      totalConversations,
      totalTranscriptions,
      totalWords
    }
  }, [conversations])

  return {
    conversations,
    currentConversationId,
    transcriptions,
    addTranscription,
    startNewConversation,
    loadConversation,
    deleteConversation,
    updateConversationTitle,
    clearAllConversations,
    exportConversations,
    importConversations,
    getCurrentConversation,
    getConversationStats
  }
}

