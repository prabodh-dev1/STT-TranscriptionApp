import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { ConversationContext } from '../context/ConversationContext';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';
import TranscriptionService from '../services/TranscriptionService';
import TranscriptionItem from '../components/TranscriptionItem';

const { width, height } = Dimensions.get('window');

const MainScreen = ({ navigation }) => {
  const { currentConversation, addTranscription, startNewConversation } = useContext(ConversationContext);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00');
  const [audioRecorderPlayer] = useState(new AudioRecorderPlayer());
  const [standbyMode, setStandbyMode] = useState(false);
  const [standbyTimer, setStandbyTimer] = useState(null);

  useEffect(() => {
    requestMicrophonePermission();
    return () => {
      if (standbyTimer) {
        clearTimeout(standbyTimer);
      }
    };
  }, []);

  const requestMicrophonePermission = async () => {
    try {
      const permission = Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.MICROPHONE 
        : PERMISSIONS.ANDROID.RECORD_AUDIO;
      
      const result = await request(permission);
      
      if (result !== RESULTS.GRANTED) {
        Alert.alert(
          'Permission Required',
          'Microphone permission is required for voice recording.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Permission request error:', error);
    }
  };

  const startRecording = async () => {
    try {
      setStandbyMode(false);
      if (standbyTimer) {
        clearTimeout(standbyTimer);
        setStandbyTimer(null);
      }

      const path = Platform.select({
        ios: 'recording.m4a',
        android: 'sdcard/recording.mp3',
      });

      const result = await audioRecorderPlayer.startRecorder(path);
      setIsRecording(true);
      
      audioRecorderPlayer.addRecordBackListener((e) => {
        const minutes = Math.floor(e.currentPosition / 60000);
        const seconds = Math.floor((e.currentPosition % 60000) / 1000);
        setRecordTime(
          `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      });

      // Start 30-second standby timer
      const timer = setTimeout(() => {
        stopRecording();
        setStandbyMode(true);
      }, 30000);
      setStandbyTimer(timer);

    } catch (error) {
      console.error('Start recording error:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      if (standbyTimer) {
        clearTimeout(standbyTimer);
        setStandbyTimer(null);
      }

      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      setRecordTime('00:00');
      setIsProcessing(true);

      // Send audio to transcription service
      const transcription = await TranscriptionService.transcribeAudio(result);
      
      if (transcription && transcription.text) {
        addTranscription({
          id: Date.now().toString(),
          text: transcription.text,
          timestamp: new Date().toISOString(),
          segments: transcription.segments || [],
        });
      }

    } catch (error) {
      console.error('Stop recording error:', error);
      Alert.alert('Error', 'Failed to process recording');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewConversation = () => {
    Alert.alert(
      'New Conversation',
      'Start a new conversation? Current conversation will be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start New', onPress: startNewConversation },
      ]
    );
  };

  const renderMicrophoneButton = () => {
    if (isProcessing) {
      return (
        <View style={[styles.micButton, styles.processingButton]}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.processingText}>Processing...</Text>
        </View>
      );
    }

    if (standbyMode) {
      return (
        <TouchableOpacity
          style={[styles.micButton, styles.standbyButton]}
          onPress={startRecording}
        >
          <Text style={styles.micIcon}>🎤</Text>
          <Text style={styles.standbyText}>Tap to Continue</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={[
          styles.micButton,
          isRecording ? styles.recordingButton : styles.idleButton
        ]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.micIcon}>🎤</Text>
        {isRecording && (
          <Text style={styles.recordTime}>{recordTime}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Voice Transcription</Text>
        <TouchableOpacity
          style={styles.newConversationButton}
          onPress={handleNewConversation}
        >
          <Text style={styles.newConversationText}>New</Text>
        </TouchableOpacity>
      </View>

      {/* Transcription Display */}
      <ScrollView style={styles.transcriptionContainer}>
        {currentConversation.transcriptions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Tap the microphone to start recording
            </Text>
          </View>
        ) : (
          currentConversation.transcriptions.map((item) => (
            <TranscriptionItem key={item.id} transcription={item} />
          ))
        )}
      </ScrollView>

      {/* Microphone Button */}
      <View style={styles.micContainer}>
        {renderMicrophoneButton()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2563eb',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 20,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  newConversationButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
  },
  newConversationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  transcriptionContainer: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.2,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  micContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  micButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  idleButton: {
    backgroundColor: '#2563eb',
  },
  recordingButton: {
    backgroundColor: '#dc2626',
  },
  standbyButton: {
    backgroundColor: '#f59e0b',
  },
  processingButton: {
    backgroundColor: '#6b7280',
  },
  micIcon: {
    fontSize: 40,
  },
  recordTime: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  standbyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  processingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
});

export default MainScreen;

