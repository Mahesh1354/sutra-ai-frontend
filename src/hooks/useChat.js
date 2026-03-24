import { useState, useCallback, useRef, useEffect } from 'react';
import { chatService } from '../services/api';
import config from '../config';

export const useChat = (conversationId = null) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(conversationId);
  const [promptType, setPromptType] = useState(config.PROMPT_TYPES.GENERAL);
  const messagesEndRef = useRef(null);

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversation) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [currentConversation]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const response = await chatService.getConversationMessages(currentConversation);
      // Transform API messages to our format
      const formattedMessages = response.data.map(msg => ({
        id: msg.id,
        type: msg.type === 'USER' ? 'user' : 'ai',
        content: msg.content,
        timestamp: new Date(msg.createdAt),
        metadata: msg.metadata ? JSON.parse(msg.metadata) : null,
        isEdited: msg.isEdited || false,
      }));
      setMessages(formattedMessages);
    } catch (err) {
      setError('Failed to load messages');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendUserMessage = useCallback(async (userMessage) => {
    if (!userMessage.trim()) return;

    // Add user message immediately
    const userMsg = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date(),
      isTemp: true,
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    // Add temporary AI message
    const tempAiMsg = {
      id: Date.now() + 1,
      type: 'ai',
      content: '',
      isLoading: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, tempAiMsg]);

    try {
      const response = await chatService.sendMessage({
        message: userMessage,
        promptType: promptType,
        conversationId: currentConversation,
        systemPrompt: null, // You can add custom system prompts here
      });

      const aiMessage = {
        id: response.data.id,
        type: 'ai',
        content: response.data.message,
        timestamp: new Date(response.data.timestamp),
        suggestions: response.data.suggestions,
        model: response.data.model,
        tokensUsed: response.data.tokensUsed,
      };

      // Update conversation ID if it's new
      if (!currentConversation && response.data.conversationId) {
        setCurrentConversation(response.data.conversationId);
      }

      // Replace temporary AI message with real response
      setMessages(prev => prev.map(msg => 
        msg.id === tempAiMsg.id ? aiMessage : msg
      ));
      
      // Update user message with real ID if needed
      if (response.data.userMessageId) {
        setMessages(prev => prev.map(msg =>
          msg.id === userMsg.id 
            ? { ...msg, id: response.data.userMessageId, isTemp: false }
            : msg
        ));
      }

      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message');
      
      // Remove the temporary AI message
      setMessages(prev => prev.filter(msg => msg.id !== tempAiMsg.id));
      
      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }]);
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentConversation, promptType]);

  const editMessage = useCallback(async (messageId, newContent) => {
    try {
      const response = await chatService.editMessage(messageId, newContent);
      
      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? { ...msg, content: newContent, isEdited: true, updatedAt: new Date() }
          : msg
      ));
      
      return response.data;
    } catch (err) {
      setError('Failed to edit message');
      throw err;
    }
  }, []);

  const deleteMessage = useCallback(async (messageId) => {
    try {
      await chatService.deleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (err) {
      setError('Failed to delete message');
      throw err;
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const changePromptType = useCallback((type) => {
    setPromptType(type);
  }, []);

  const resetConversation = useCallback(() => {
    setCurrentConversation(null);
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendUserMessage,
    editMessage,
    deleteMessage,
    clearMessages,
    messagesEndRef,
    currentConversation,
    promptType,
    changePromptType,
    resetConversation,
    loadMessages,
  };
};