import React from 'react';

const MessageSkeleton = ({ type = 'assistant' }) => {
  const isUser = type === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-pulse`}>
      <div className={`flex gap-3 max-w-[85%] sm:max-w-[80%] lg:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar Skeleton */}
        <div className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full ${
          isUser 
            ? 'bg-linear-to-br from-blue-400 to-blue-500' 
            : 'bg-linear-to-br from-gray-400 to-gray-500'
        }`}></div>
        
        {/* Message Bubble Skeleton */}
        <div className={`rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-linear-to-br from-blue-400/50 to-blue-500/50' 
            : 'bg-gray-200 dark:bg-gray-700'
        }`}>
          {/* Content Lines */}
          <div className="space-y-2">
            <div className={`h-3 rounded ${
              isUser ? 'bg-blue-300/50' : 'bg-gray-300 dark:bg-gray-600'
            } w-32`}></div>
            <div className={`h-3 rounded ${
              isUser ? 'bg-blue-300/50' : 'bg-gray-300 dark:bg-gray-600'
            } w-48`}></div>
            <div className={`h-3 rounded ${
              isUser ? 'bg-blue-300/50' : 'bg-gray-300 dark:bg-gray-600'
            } w-40`}></div>
          </div>
          
          {/* Timestamp Skeleton */}
          <div className={`h-2 rounded mt-2 ${
            isUser ? 'bg-blue-300/30' : 'bg-gray-300/50 dark:bg-gray-600/50'
          } w-12`}></div>
        </div>
      </div>
    </div>
  );
};

export default MessageSkeleton;