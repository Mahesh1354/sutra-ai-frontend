import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, Mic } from 'lucide-react';

const ChatInput = ({ onSendMessage, isLoading, onStop }) => {
  const [message, setMessage] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const textareaRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const maxHeight = isMobile ? 80 : 120;
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`;
    }
  }, [message, isMobile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isLoading ? "AI is thinking..." : (isMobile ? "Type a message..." : "Ask me anything... (Press Enter to send)")}
              rows={1}
              className="w-full resize-none rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 transition-all"
              disabled={isLoading}
            />
          </div>
          
          {isLoading ? (
            <button
              type="button"
              onClick={onStop}
              className="flex items-center justify-center gap-2 rounded-2xl bg-red-500 hover:bg-red-600 px-4 py-3 text-white font-medium transition-all hover:scale-105 active:scale-95"
              aria-label="Stop generating"
            >
              <Square className="w-4 h-4" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                className="flex items-center justify-center rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Voice input"
                title="Voice input (coming soon)"
                disabled
              >
                <Mic className="w-4 h-4" />
              </button>
              
              <button
                type="submit"
                disabled={!message.trim()}
                className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-5 py-3 text-white font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md hover:shadow-lg"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          )}
        </form>
        
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
          AI may produce inaccurate information. Verify important details.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;