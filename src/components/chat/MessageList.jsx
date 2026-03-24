import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { Sparkles, MessageSquare, Code, PenTool, Search } from 'lucide-react';

const MessageList = ({ messages, messagesEndRef, onEditMessage, onDeleteMessage }) => {
  const containerRef = useRef(null);

  // Enhanced empty state with suggestions
  if (messages.length === 0) {
    const suggestions = [
      {
        icon: Code,
        title: "Coding Help",
        description: "Write a Python function, debug code, or explain algorithms",
        prompt: "Write a Python function to sort a list using quicksort",
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-50 dark:bg-blue-950/30"
      },
      {
        icon: PenTool,
        title: "Creative Writing",
        description: "Stories, poems, creative ideas, and brainstorming",
        prompt: "Write a creative story about a futuristic city",
        color: "from-purple-500 to-pink-500",
        bgColor: "bg-purple-50 dark:bg-purple-950/30"
      },
      {
        icon: Search,
        title: "Explanations",
        description: "Complex topics explained in simple terms",
        prompt: "Explain quantum computing in simple terms",
        color: "from-green-500 to-emerald-500",
        bgColor: "bg-green-50 dark:bg-green-950/30"
      },
      {
        icon: MessageSquare,
        title: "General Chat",
        description: "Ask anything, get helpful responses",
        prompt: "What are the latest developments in AI?",
        color: "from-orange-500 to-red-500",
        bgColor: "bg-orange-50 dark:bg-orange-950/30"
      }
    ];

    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-3xl">
          {/* Animated Logo */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative w-24 h-24 mx-auto rounded-2xl bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-2xl animate-scale-in">
              <Sparkles className="w-12 h-12 text-white animate-pulse-slow" />
            </div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Welcome to Aura AI
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Your intelligent assistant powered by Google's Gemini AI. Ask me anything!
          </p>
          
          {/* Suggestion Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {suggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <div
                  key={index}
                  onClick={() => {
                    const sendMessage = window.__sendMessage;
                    if (sendMessage) sendMessage(suggestion.prompt);
                  }}
                  className={`group p-4 ${suggestion.bgColor} rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 animate-slide-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-linear-to-r ${suggestion.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {suggestion.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {suggestion.description}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                        Try: {suggestion.prompt.substring(0, 40)}...
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.map((message, index) => (
          <div 
            key={message.id} 
            className="animate-slide-in-up"
            style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
          >
            <ChatMessage
              message={message}
              onEdit={onEditMessage ? (content) => onEditMessage(message.id, content) : undefined}
              onDelete={onDeleteMessage ? () => onDeleteMessage(message.id) : undefined}
              canEdit={message.type === 'user'}
            />
          </div>
        ))}
        
        {/* Typing indicator placeholder */}
        {messages.length > 0 && messages[messages.length - 1]?.isStreaming && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex gap-3 max-w-[80%]">
              <div className="shrink-0 w-8 h-8 rounded-full bg-linear-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;