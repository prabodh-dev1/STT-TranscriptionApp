import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { ConversationContext } from '../context/ConversationContext';

const ConversationHistoryScreen = ({ navigation }) => {
  const { 
    conversations, 
    currentConversation, 
    loadConversation, 
    deleteConversation 
  } = useContext(ConversationContext);

  const handleConversationPress = (conversation) => {
    loadConversation(conversation.id);
    navigation.navigate('Home');
  };

  const handleDeleteConversation = (conversationId) => {
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteConversation(conversationId)
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getConversationPreview = (transcriptions) => {
    if (transcriptions.length === 0) return 'No transcriptions';
    const firstText = transcriptions[0].text;
    return firstText.length > 100 ? firstText.substring(0, 100) + '...' : firstText;
  };

  const renderConversationItem = ({ item }) => {
    const isCurrentConversation = item.id === currentConversation.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.conversationItem,
          isCurrentConversation && styles.currentConversationItem
        ]}
        onPress={() => handleConversationPress(item)}
      >
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationTitle}>
            {item.title || `Conversation ${item.id.slice(-4)}`}
          </Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteConversation(item.id)}
          >
            <Text style={styles.deleteButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.conversationDate}>
          {formatDate(item.createdAt)}
        </Text>
        
        <Text style={styles.conversationPreview}>
          {getConversationPreview(item.transcriptions)}
        </Text>
        
        <Text style={styles.transcriptionCount}>
          {item.transcriptions.length} transcription{item.transcriptions.length !== 1 ? 's' : ''}
        </Text>
        
        {isCurrentConversation && (
          <View style={styles.currentBadge}>
            <Text style={styles.currentBadgeText}>Current</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conversation History</Text>
        <View style={styles.placeholder} />
      </View>

      {conversations.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No conversations yet
          </Text>
          <Text style={styles.emptyStateSubtext}>
            Start recording to create your first conversation
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  listContainer: {
    padding: 16,
  },
  conversationItem: {
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
  currentConversationItem: {
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  conversationDate: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  conversationPreview: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 8,
  },
  transcriptionCount: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  currentBadge: {
    position: 'absolute',
    top: 12,
    right: 40,
    backgroundColor: '#2563eb',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  currentBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
});

export default ConversationHistoryScreen;

