import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { colors, shadow } from '../../src/theme';
import io from 'socket.io-client';
import { apiGet, apiPost, API_BASE_URL } from '../api/client';
import { Ionicons } from '@expo/vector-icons';

export default function MessagesScreen({ navigation, route }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const me = 'demo-user-id';
  
  // Demo conversations and peer data
  const demoPeer = {
    id: 'demo-peer-id',
    name: 'Dr. Sarah Johnson',
    avatar: 'https://placekitten.com/100/100',
    status: 'Online',
    specialization: 'Veterinary Specialist'
  };

  const demoMessages = [
    {
      _id: '1',
      from: demoPeer.id,
      content: 'Hello! How can I help you with your animals today?',
      ts: Date.now() - 3600000,
      type: 'text',
      read: true
    },
    {
      _id: '2',
      from: me,
      content: 'Hi Dr. Johnson! One of my chickens seems sick.',
      ts: Date.now() - 3500000,
      type: 'text',
      read: true
    },
    {
      _id: '3',
      from: demoPeer.id,
      content: 'Can you describe the symptoms?',
      ts: Date.now() - 3400000,
      type: 'text',
      read: true
    },
    {
      _id: '4',
      from: me,
      content: 'She\'s not eating and seems lethargic.',
      ts: Date.now() - 3300000,
      type: 'text',
      read: true
    },
    {
      _id: '5',
      from: demoPeer.id,
      content: 'I recommend isolating her and checking for respiratory issues. Would you like to schedule a video consultation?',
      ts: Date.now() - 3200000,
      type: 'text',
      read: true
    }
  ];

  useEffect(() => {
    // Initialize socket connection
    const s = io(API_BASE_URL, { 
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5
    });
    
    s.on('connect', () => {
      console.log('Connected to chat server');
      s.emit('join', me);
    });
    
    s.on('message', (payload) => {
      setMessages((prev) => [
        ...prev,
        {
          _id: Date.now().toString(),
          from: payload.fromUserId || demoPeer.id,
          content: payload.message,
          ts: payload.ts || Date.now(),
          type: 'text',
          read: false
        },
      ]);
      scrollToBottom();
    });

    s.on('typing', (data) => {
      if (data.userId === demoPeer.id) {
        setIsTyping(data.typing);
      }
    });

    s.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });

    setSocket(s);
    return () => s.disconnect();
  }, []);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    setLoading(true);
    // Simulate API call with demo data
    setTimeout(() => {
      apiGet(`/api/messages/with/${demoPeer.id}`)
        .then(data => {
          setMessages(data && data.length > 0 ? data : demoMessages);
        })
        .catch(() => {
          setMessages(demoMessages);
        })
        .finally(() => {
          setLoading(false);
          setRefreshing(false);
          scrollToBottom();
        });
    }, 1000);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleTyping = (typing) => {
    socket?.emit('typing', { 
      userId: me, 
      typing, 
      toUserId: demoPeer.id 
    });
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    
    const newMessage = {
      _id: Date.now().toString(),
      from: me,
      content: text.trim(),
      ts: Date.now(),
      type: 'text',
      read: false
    };

    setMessages(prev => [...prev, newMessage]);
    setText('');
    handleTyping(false);
    
    // Simulate sending via socket and API
    socket?.emit('message', { 
      toUserId: demoPeer.id, 
      message: text.trim(), 
      fromUserId: me 
    });
    
    await apiPost('/api/messages', { 
      to: demoPeer.id, 
      content: text.trim() 
    }).catch(() => {});
    
    scrollToBottom();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const shouldShowDate = (currentMessage, previousMessage) => {
    if (!previousMessage) return true;
    
    const currentDate = new Date(currentMessage.ts).toDateString();
    const previousDate = new Date(previousMessage.ts).toDateString();
    
    return currentDate !== previousDate;
  };

  const renderMessage = ({ item, index }) => {
    const isMe = item.from === me;
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const showDate = shouldShowDate(item, previousMessage);

    return (
      <View>
        {showDate && (
          <View style={styles.dateSeparator}>
            <Text style={styles.dateText}>{formatDate(item.ts)}</Text>
          </View>
        )}
        
        <View style={[
          styles.messageContainer,
          isMe ? styles.myMessageContainer : styles.theirMessageContainer
        ]}>
          {!isMe && (
            <Image source={{ uri: demoPeer.avatar }} style={styles.avatar} />
          )}
          
          <View style={[
            styles.messageBubble,
            isMe ? styles.myBubble : styles.theirBubble
          ]}>
            <Text style={[
              styles.messageText,
              isMe ? styles.myMessageText : styles.theirMessageText
            ]}>
              {item.content}
            </Text>
            <Text style={[
              styles.timeText,
              isMe ? styles.myTimeText : styles.theirTimeText
            ]}>
              {formatTime(item.ts)}
            </Text>
          </View>

          {isMe && item.read && (
            <Ionicons name="checkmark-done" size={16} color={colors.primary} style={styles.readIcon} />
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Chat Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Image source={{ uri: demoPeer.avatar }} style={styles.headerAvatar} />
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{demoPeer.name}</Text>
          <Text style={styles.headerStatus}>
            {isTyping ? 'Typing...' : demoPeer.status}
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="call" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="videocam" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadMessages}
            colors={[colors.primary]}
          />
        }
        onContentSizeChange={scrollToBottom}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <View style={styles.typingBubble}>
            <Text style={styles.typingText}>
              {demoPeer.name.split(' ')[0]} is typing...
            </Text>
          </View>
        </View>
      )}

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachmentButton}>
          <Ionicons name="attach" size={24} color={colors.textMuted} />
        </TouchableOpacity>
        
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          style={styles.textInput}
          multiline
          maxLength={500}
          onFocus={() => handleTyping(true)}
          onBlur={() => handleTyping(false)}
          onEndEditing={() => handleTyping(false)}
        />
        
        {text ? (
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.mediaButton}>
            <Ionicons name="camera" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    color: colors.textMuted,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingTop: 40,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  headerStatus: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 4,
    maxWidth: '100%',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  theirMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 18,
    ...shadow.card,
  },
  myBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  theirMessageText: {
    color: colors.text,
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    opacity: 0.7,
  },
  myTimeText: {
    color: '#FFFFFF',
    textAlign: 'right',
  },
  theirTimeText: {
    color: colors.textMuted,
  },
  readIcon: {
    marginLeft: 4,
    marginBottom: 4,
  },
  typingContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  typingBubble: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
    maxWidth: '70%',
  },
  typingText: {
    fontSize: 14,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  attachmentButton: {
    padding: 8,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  mediaButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: colors.surface,
  },
});