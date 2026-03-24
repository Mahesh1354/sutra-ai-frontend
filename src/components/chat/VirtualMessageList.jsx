import React, { useRef, useEffect, useState } from 'react';
import { VariableSizeList as List } from 'react-window';
import ChatMessage from './ChatMessage';
import { Sparkles } from 'lucide-react';

const VirtualMessageList = ({ messages, onEditMessage, onDeleteMessage }) => {
  const listRef = useRef(null);
  const [messageHeights, setMessageHeights] = useState({});
  const [containerHeight, setContainerHeight] = useState(window.innerHeight - 200);

  useEffect(() => {
    const handleResize = () => {
      setContainerHeight(window.innerHeight - 200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom on new messages
    if (listRef.current && messages.length > 0) {
      listRef.current.scrollToItem(messages.length - 1, 'end');
    }
  }, [messages.length]);

  const getItemSize = (index) => {
    const message = messages[index];
    if (!message) return 100;
    
    // Estimate height based on content length
    const baseHeight = 80;
    const contentLength = message.content?.length || 0;
    const lines = Math.ceil(contentLength / 50);
    return Math.min(baseHeight + lines * 20, 300);
  };

  const Row = ({ index, style }) => {
    const message = messages[index];
    if (!message) return null;
    
    return (
      <div style={style}>
        <div className="py-2">
          <ChatMessage
            message={message}
            onEdit={onEditMessage ? (content) => onEditMessage(message.id, content) : undefined}
            onDelete={onDeleteMessage ? () => onDeleteMessage(message.id) : undefined}
            canEdit={message.type === 'user'}
          />
        </div>
      </div>
    );
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-xl">
            <Sparkles className="w-10 h-10 text-white animate-pulse-slow" />
          </div>
          <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Welcome to Aura AI
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your intelligent assistant powered by Google's Gemini AI
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <List
        ref={listRef}
        height={containerHeight}
        itemCount={messages.length}
        itemSize={getItemSize}
        width="100%"
        className="scroll-smooth"
      >
        {Row}
      </List>
    </div>
  );
};

export default VirtualMessageList;