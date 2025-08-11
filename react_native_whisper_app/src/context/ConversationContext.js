import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ConversationContext = createContext();

const STORAGE_KEY = 'whisper_conversations';

export const ConversationProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState({
    id: null,
    title: '',
    createdAt: new Date().toISOString(),
    transcriptions: [],
  });

  useEffect(() => {
    loadConversationsFromStorage();
  }, []);

  useEffect(() => {
    saveConversationsToStorage();
  }, [conversations]);

  const loadConversationsFromStorage = async () => {
    try {
      const storedConversations = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedConversations) {
        const parsedConversations = JSON.parse(storedConversations);
        setConversations(parsedConversations);
        
        // Load the most recent conversation as current if no current conversation exists
        if (parsedConversations.length > 0 && !currentConversation.id) {
          const mostRecent = parsedConversations[0];
          setCurrentConversation(mostRecent);
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const saveConversationsToStorage = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error('Error saving conversations:', error);
    }
  };

  const startNewConversation = () => {
    // Save current conversation if it has transcriptions
    if (currentConversation.transcriptions.length > 0) {
      saveCurrentConversation();
    }

    // Create new conversation
    const newConversation = {
      id: Date.now().toString(),
      title: '',
      createdAt: new Date().toISOString(),
      transcriptions: [],
    };

    setCurrentConversation(newConversation);
  };

  const saveCurrentConversation = () => {
    if (currentConversation.transcriptions.length === 0) return;

    const updatedConversations = [...conversations];
    const existingIndex = updatedConversations.findIndex(
      conv => conv.id === currentConversation.id
    );

    // Generate title from first transcription if not set
    const title = currentConversation.title || 
      generateConversationTitle(currentConversation.transcriptions[0]?.text);

    const conversationToSave = {
      ...currentConversation,
      title,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      updatedConversations[existingIndex] = conversationToSave;
    } else {
      updatedConversations.unshift(conversationToSave);
    }

    setConversations(updatedConversations);
  };

  const generateConversationTitle = (firstText) => {
    if (!firstText) return 'Untitled Conversation';
    
    // Take first 30 characters and add ellipsis if longer
    const title = firstText.length > 30 
      ? firstText.substring(0, 30).trim() + '...'
      : firstText.trim();
    
    return title || 'Untitled Conversation';
  };

  const addTranscription = (transcription) => {
    const updatedConversation = {
      ...currentConversation,
      transcriptions: [...currentConversation.transcriptions, transcription],
    };

    // If this is the first transcription and no ID exists, create one
    if (!currentConversation.id) {
      updatedConversation.id = Date.now().toString();
    }

    setCurrentConversation(updatedConversation);
    
    // Auto-save after adding transcription
    setTimeout(() => {
      saveCurrentConversation();
    }, 1000);
  };

  const loadConversation = (conversationId) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  };

  const deleteConversation = (conversationId) => {
    const updatedConversations = conversations.filter(
      conv => conv.id !== conversationId
    );
    setConversations(updatedConversations);

    // If deleted conversation was current, start new one
    if (currentConversation.id === conversationId) {
      startNewConversation();
    }
  };

  const updateConversationTitle = (conversationId, newTitle) => {
    const updatedConversations = conversations.map(conv =>
      conv.id === conversationId ? { ...conv, title: newTitle } : conv
    );
    setConversations(updatedConversations);

    // Update current conversation if it's the one being edited
    if (currentConversation.id === conversationId) {
      setCurrentConversation(prev => ({ ...prev, title: newTitle }));
    }
  };

  const deleteTranscription = (transcriptionId) => {
    const updatedTranscriptions = currentConversation.transcriptions.filter(
      trans => trans.id !== transcriptionId
    );
    
    const updatedConversation = {
      ...currentConversation,
      transcriptions: updatedTranscriptions,
    };
    
    setCurrentConversation(updatedConversation);
    
    // Auto-save after deletion
    setTimeout(() => {
      saveCurrentConversation();
    }, 500);
  };

  const value = {
    conversations,
    currentConversation,
    startNewConversation,
    addTranscription,
    loadConversation,
    deleteConversation,
    updateConversationTitle,
    deleteTranscription,
    saveCurrentConversation,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};

