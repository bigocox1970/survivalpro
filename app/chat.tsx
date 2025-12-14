import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLlamaModel } from '../src/hooks/useLlamaModel';
import { useTheme } from '../src/context/ThemeContext';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export default function ChatScreen() {
  const { isDark } = useTheme();
  const styles = createStyles(isDark);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'system',
      content: 'Welcome! I\'m your offline survival AI assistant. Ask me anything about survival techniques, emergency preparedness, or wilderness skills. All responses are generated locally on your device.',
      timestamp: new Date(),
    },
  ]);

  const { 
    isLoaded, 
    isLoading, 
    isGenerating, 
    loadModel, 
    generateResponse,
    modelStatus,
    downloadProgress,
  } = useLlamaModel();

  useEffect(() => {
    // Auto-load model on mount
    if (!isLoaded && !isLoading) {
      loadModel();
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Generate response
    const response = await generateResponse(input.trim());
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const suggestedQuestions = [
    'How do I purify water in the wild?',
    'What are signs of hypothermia?',
    'How to signal for rescue?',
    'Which wild plants are safe to eat?',
  ];

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Model Status Banner */}
      <View style={styles.statusBanner}>
        <View style={styles.statusIndicator}>
          <View style={[
            styles.statusDot,
            { backgroundColor: isLoaded ? '#4ade80' : isLoading ? '#f59e0b' : '#ef4444' }
          ]} />
          <Text style={styles.statusText}>
            {modelStatus}
          </Text>
        </View>
        {downloadProgress > 0 && downloadProgress < 100 && (
          <Text style={styles.progressText}>{downloadProgress.toFixed(0)}%</Text>
        )}
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.role === 'user' ? styles.userBubble : styles.assistantBubble,
              message.role === 'system' && styles.systemBubble,
            ]}
          >
            <Text style={[
              styles.messageText,
              message.role === 'user' && styles.userText,
              message.role === 'system' && styles.systemText,
            ]}>
              {message.content}
            </Text>
          </View>
        ))}

        {isGenerating && (
          <View style={[styles.messageBubble, styles.assistantBubble]}>
            <ActivityIndicator size="small" color="#e94560" />
            <Text style={styles.generatingText}>Thinking...</Text>
          </View>
        )}

        {/* Suggested Questions (show when no user messages yet) */}
        {messages.length === 1 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Try asking:</Text>
            {suggestedQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => setInput(question)}
              >
                <Text style={styles.suggestionText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder={isLoaded ? "Ask a survival question..." : "Loading AI model..."}
          placeholderTextColor={isDark ? '#6a6a8a' : '#999'}
          editable={isLoaded && !isGenerating}
          multiline
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!input.trim() || !isLoaded || isGenerating) && styles.sendButtonDisabled
          ]}
          onPress={sendMessage}
          disabled={!input.trim() || !isLoaded || isGenerating}
        >
          <Ionicons
            name="send"
            size={20}
            color={(!input.trim() || !isLoaded || isGenerating) ? '#6a6a8a' : '#ffffff'}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#1a1a2e' : '#f5f5f5',
    },
    statusBanner: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: isDark ? '#16213e' : '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#2a2a4e' : '#e0e0e0',
    },
    statusIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    statusText: {
      fontSize: 12,
      color: isDark ? '#a0a0b0' : '#666',
    },
    progressText: {
      fontSize: 12,
      color: '#f59e0b',
      fontWeight: '600',
    },
    messagesContainer: {
      flex: 1,
    },
    messagesContent: {
      padding: 16,
      paddingBottom: 120,
    },
    messageBubble: {
      maxWidth: '85%',
      padding: 12,
      borderRadius: 16,
      marginBottom: 12,
    },
    userBubble: {
      backgroundColor: '#e94560',
      alignSelf: 'flex-end',
      borderBottomRightRadius: 4,
    },
    assistantBubble: {
      backgroundColor: isDark ? '#16213e' : '#ffffff',
      alignSelf: 'flex-start',
      borderBottomLeftRadius: 4,
    },
    systemBubble: {
      backgroundColor: isDark ? '#0f0f23' : '#e8f4f8',
      alignSelf: 'center',
      maxWidth: '95%',
    },
    messageText: {
      fontSize: 15,
      lineHeight: 22,
      color: isDark ? '#eaeaea' : '#333',
    },
    userText: {
      color: '#ffffff',
    },
    systemText: {
      textAlign: 'center',
      fontStyle: 'italic',
      color: isDark ? '#a0a0b0' : '#666',
    },
    generatingText: {
      fontSize: 14,
      color: isDark ? '#a0a0b0' : '#666',
      marginLeft: 8,
    },
    suggestionsContainer: {
      marginTop: 16,
    },
    suggestionsTitle: {
      fontSize: 14,
      color: isDark ? '#8a8aaa' : '#666',
      marginBottom: 12,
    },
    suggestionChip: {
      backgroundColor: isDark ? '#16213e' : '#ffffff',
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 20,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: isDark ? '#2a2a4e' : '#e0e0e0',
    },
    suggestionText: {
      fontSize: 14,
      color: isDark ? '#c0c0d0' : '#333',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      padding: 12,
      backgroundColor: isDark ? '#16213e' : '#ffffff',
      borderTopWidth: 1,
      borderTopColor: isDark ? '#2a2a4e' : '#e0e0e0',
    },
    input: {
      flex: 1,
      backgroundColor: isDark ? '#0f0f23' : '#f5f5f5',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      fontSize: 16,
      color: isDark ? '#eaeaea' : '#333',
      maxHeight: 100,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#e94560',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
    },
    sendButtonDisabled: {
      backgroundColor: isDark ? '#2a2a4e' : '#e0e0e0',
    },
  });
