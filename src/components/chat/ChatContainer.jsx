import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { useChat } from '../../hooks/useChat';
import { PROMPT_TYPES, SYSTEM_PROMPTS } from '../../utils/constants';
import { Settings, X, ChevronDown, BookOpen, MessageSquare, Plus } from 'lucide-react';

const ChatContainer = ({ conversationId, onConversationChange }) => {
  const {
    messages,
    isLoading,
    isStreaming,
    error,
    sendUserMessage,
    editMessage,
    deleteMessage,
    messagesEndRef,
    currentConversation,
    promptType,
    changePromptType,
    resetConversation,
    stopStreaming,
  } = useChat(conversationId);

  const [showSettings, setShowSettings] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track scroll for header shadow
  useEffect(() => {
    const handleScroll = () => {
      const messagesContainer = document.querySelector('.chat-messages-container');
      if (messagesContainer) {
        setIsScrolled(messagesContainer.scrollTop > 10);
      }
    };

    const messagesContainer = document.querySelector('.chat-messages-container');
    if (messagesContainer) {
      messagesContainer.addEventListener('scroll', handleScroll);
      return () => messagesContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleNewChat = () => {
    resetConversation();
    onConversationChange?.(null);
  };

  const handleStop = () => {
    if (stopStreaming) {
      stopStreaming();
    }
  };

  const getPromptTypeIcon = (type) => {
    switch(type) {
      case 'coding': return '💻';
      case 'creative': return '🎨';
      default: return '📖';
    }
  };

  const getPromptTypeDescription = (type) => {
    switch(type) {
      case 'coding':
        return 'Expert programming assistance with code examples';
      case 'creative':
        return 'Creative writing and storytelling help';
      default:
        return 'General conversation and assistance';
    }
  };

  return (
    <div className="flex flex-col h-full bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Header with enhanced styling */}
      <header className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 transition-shadow ${
        isScrolled ? 'shadow-md' : ''
      }`}>
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Sutra AI Assistant
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Weaving knowledge into every response
                </p>
              </div>
            </div>
            
            {/* Desktop Controls */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Prompt Type Selector with enhanced styling */}
              <div className="relative group">
                <select
                  value={promptType}
                  onChange={(e) => changePromptType(e.target.value)}
                  className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer appearance-none pr-10 font-medium"
                >
                  {PROMPT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  showSettings 
                    ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleNewChat}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-medium transition-all hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                New Thread
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-xl transition-all ${
                  showSettings 
                    ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleNewChat}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium"
              >
                <Plus className="w-4 h-4" />
                New
              </button>
            </div>
          </div>

          {/* Mobile Prompt Type Selector */}
          <div className="sm:hidden mt-3">
            <div className="relative">
              <select
                value={promptType}
                onChange={(e) => changePromptType(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none"
              >
                {PROMPT_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label} - {getPromptTypeDescription(type.value)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </header>

      {/* Settings Panel - Enhanced */}
      {showSettings && (
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-4 sm:p-5 animate-slide-in-down shadow-lg">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Thread Configuration
                </h3>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close settings"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{getPromptTypeIcon(promptType)}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {PROMPT_TYPES.find(t => t.value === promptType)?.label} Mode
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {getPromptTypeDescription(promptType)}
              </p>
              <textarea
                value={SYSTEM_PROMPTS[promptType]}
                readOnly
                className="w-full p-3 text-xs sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 resize-none font-mono"
                rows={isMobile ? 3 : 4}
              />
            </div>
            
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
              System prompt is automatically configured based on the selected mode
            </p>
          </div>
        </div>
      )}

      {/* Error Banner - Enhanced */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 p-4 animate-slide-in-down">
          <div className="max-w-4xl mx-auto flex items-start gap-3">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-300">Error</p>
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Welcome Message - Enhanced for empty state */}
      {messages.length === 0 && !error && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-2xl">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-xl">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-3">
              Welcome to Sutra AI
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Weaving knowledge into every response. Ask me anything!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group" onClick={() => sendUserMessage("Write a Python function to sort a list")}>
                <div className="text-2xl mb-2">💻</div>
                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  Coding Threads
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Expert programming assistance
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group" onClick={() => sendUserMessage("Write a creative story about a magical forest")}>
                <div className="text-2xl mb-2">🎨</div>
                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Creative Weaves
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Stories, poems, and imagination
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group" onClick={() => sendUserMessage("Explain quantum computing in simple terms")}>
                <div className="text-2xl mb-2">🔬</div>
                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  Wisdom Threads
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Complex topics simplified
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group" onClick={() => sendUserMessage("What are the latest trends in AI?")}>
                <div className="text-2xl mb-2">🧵</div>
                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Knowledge Threads
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Latest insights and discoveries
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages Container with custom scroll class */}
      <div className="flex-1 overflow-y-auto chat-messages-container">
        <MessageList 
          messages={messages} 
          messagesEndRef={messagesEndRef}
          onEditMessage={editMessage}
          onDeleteMessage={deleteMessage}
        />
      </div>

      {/* Input */}
      <ChatInput
        onSendMessage={sendUserMessage}
        isLoading={isLoading}
        isStreaming={isStreaming}
        onStop={handleStop}
      />
    </div>
  );
};

export default ChatContainer;