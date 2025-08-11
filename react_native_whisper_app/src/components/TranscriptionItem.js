import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { ConversationContext } from '../context/ConversationContext';

const TranscriptionItem = ({ transcription }) => {
  const { deleteTranscription } = useContext(ConversationContext);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleCopyToClipboard = () => {
    Clipboard.setString(transcription.text);
    Alert.alert(
      'Copied!',
      'Text copied to clipboard',
      [{ text: 'OK' }],
      { duration: 1500 }
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Transcription',
      'Are you sure you want to delete this transcription?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteTranscription(transcription.id)
        },
      ]
    );
  };

  const renderSegments = () => {
    if (!transcription.segments || transcription.segments.length === 0) {
      return (
        <Text style={styles.transcriptionText}>
          {transcription.text}
        </Text>
      );
    }

    return (
      <View style={styles.segmentsContainer}>
        {transcription.segments.map((segment, index) => (
          <View key={index} style={styles.segmentItem}>
            <Text style={styles.segmentTime}>
              {Math.floor(segment.start)}s - {Math.floor(segment.end)}s
            </Text>
            <Text style={styles.segmentText}>
              {segment.text.trim()}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.timestamp}>
          {formatTime(transcription.timestamp)}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCopyToClipboard}
          >
            <Text style={styles.actionButtonText}>📋</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={styles.actionButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {transcription.segments && transcription.segments.length > 1 ? (
          renderSegments()
        ) : (
          <Text style={styles.transcriptionText}>
            {transcription.text}
          </Text>
        )}
      </View>

      {/* Copy overlay for long press */}
      <TouchableOpacity
        style={styles.copyOverlay}
        onLongPress={handleCopyToClipboard}
        activeOpacity={0.7}
      >
        <View style={styles.copyHint}>
          <Text style={styles.copyHintText}>Long press to copy</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timestamp: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
  },
  actionButtonText: {
    fontSize: 14,
  },
  content: {
    minHeight: 40,
  },
  transcriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1e293b',
  },
  segmentsContainer: {
    gap: 8,
  },
  segmentItem: {
    borderLeftWidth: 3,
    borderLeftColor: '#2563eb',
    paddingLeft: 12,
    paddingVertical: 4,
  },
  segmentTime: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 2,
  },
  segmentText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
  },
  copyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  copyHint: {
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    opacity: 0,
  },
  copyHintText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default TranscriptionItem;

