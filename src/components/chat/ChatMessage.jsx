import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Bot, User, AlertCircle, Edit2, Trash2, Copy, Check } from 'lucide-react';

const ChatMessage = ({ message, onEdit, onDelete, canEdit = true }) => {
  const isUser = message.type === 'user';
  const isError = message.type === 'error';
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [copied, setCopied] = useState(false);
  const isDarkMode = document.documentElement.classList.contains('dark');

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit?.(editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(message.content);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'} animate-slide-in-up`}>
      <div className={`flex gap-3 max-w-[85%] sm:max-w-[80%] lg:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-md ${
          isUser 
            ? 'bg-linear-to-r from-blue-500 to-blue-600' 
            : isError 
            ? 'bg-linear-to-r from-red-500 to-red-600' 
            : 'bg-linear-to-r from-gray-600 to-gray-700'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          ) : isError ? (
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          ) : (
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className={`relative rounded-2xl px-4 py-2.5 shadow-sm ${
          isUser 
            ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white' 
            : isError 
            ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
        }`}>
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {message.isLoading ? (
                <div className="flex items-center gap-1 py-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce opacity-60"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.2s' }}></div>
                </div>
              ) : (
                <div className={`prose prose-sm max-w-none ${
                  isUser 
                    ? 'prose-invert' 
                    : 'dark:prose-invert'
                }`}>
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const codeContent = String(children).replace(/\n$/, '');
                        
                        return !inline && match ? (
                          <div className="relative group">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(codeContent);
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-gray-800 dark:bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-700 dark:hover:bg-gray-600"
                              aria-label="Copy code"
                            >
                              <Copy className="w-4 h-4 text-white" />
                            </button>
                            <SyntaxHighlighter
                              style={isDarkMode ? vscDarkPlus : vs}
                              language={match[1]}
                              PreTag="div"
                              className="rounded-lg mt-0! mb-2!"
                              {...props}
                            >
                              {codeContent}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <code className={`${className} ${
                            isUser 
                              ? 'bg-blue-400/30 text-white px-1.5 py-0.5 rounded' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded'
                          }`} {...props}>
                            {children}
                          </code>
                        );
                      },
                      a({ href, children }) {
                        return (
                          <a 
                            href={href} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`${isUser ? 'text-blue-100 underline' : 'text-blue-600 dark:text-blue-400 underline'} hover:opacity-80`}
                          >
                            {children}
                          </a>
                        );
                      },
                      p({ children }) {
                        return <p className="leading-relaxed">{children}</p>;
                      },
                      ul({ children }) {
                        return <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>;
                      },
                      ol({ children }) {
                        return <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>;
                      },
                      li({ children }) {
                        return <li className="ml-2">{children}</li>;
                      },
                      blockquote({ children }) {
                        return (
                          <blockquote className={`border-l-4 pl-4 my-2 italic ${
                            isUser ? 'border-blue-300' : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {children}
                          </blockquote>
                        );
                      },
                      h1({ children }) {
                        return <h1 className="text-xl font-bold my-2">{children}</h1>;
                      },
                      h2({ children }) {
                        return <h2 className="text-lg font-bold my-2">{children}</h2>;
                      },
                      h3({ children }) {
                        return <h3 className="text-base font-bold my-1">{children}</h3>;
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
              
              {/* Message Actions */}
              {!message.isLoading && !isEditing && canEdit && !isError && (
                <div className="absolute -top-8 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Copy message"
                    title="Copy"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />}
                  </button>
                  {isUser && onEdit && (
                    <button
                      onClick={handleEdit}
                      className="p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Edit message"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete()}
                      className="p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      aria-label="Delete message"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  )}
                </div>
              )}
            </>
          )}
          
          {/* Timestamp */}
          <div className={`text-xs mt-1.5 ${
            isUser 
              ? 'text-blue-100' 
              : isError 
              ? 'text-red-400 dark:text-red-400' 
              : 'text-gray-400 dark:text-gray-500'
          }`}>
            {formatTime(message.timestamp)}
            {message.isEdited && !isEditing && (
              <span className="ml-2 italic opacity-75">(edited)</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChatMessage);