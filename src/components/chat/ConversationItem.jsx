import React, { useState } from 'react';
import { MoreVertical, Edit2, Trash2, Pin, PinOff, Check, X, MessageSquare } from 'lucide-react';

const ConversationItem = ({ 
  conversation, 
  isActive, 
  onSelect, 
  onDelete, 
  onRename, 
  onPin 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(conversation.title);

  const handleRename = () => {
    if (editTitle.trim() && editTitle !== conversation.title) {
      onRename(editTitle.trim());
    }
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`group relative mx-2 my-1 rounded-xl cursor-pointer transition-all duration-200 ${
        isActive 
          ? 'bg-linear-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 shadow-sm' 
          : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
      }`}
      onClick={() => !isEditing && onSelect()}
    >
      <div className="flex items-start justify-between p-3">
        {/* Icon and Content */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Conversation Icon */}
          <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            isActive 
              ? 'bg-blue-500 text-white shadow-sm' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
          }`}>
            <MessageSquare className="w-4 h-4" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRename();
                    if (e.key === 'Escape') setIsEditing(false);
                  }}
                />
                <button
                  onClick={handleRename}
                  className="p-1.5 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-lg transition-colors"
                  aria-label="Save"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                  aria-label="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <p className={`text-sm font-medium truncate ${
                  isActive 
                    ? 'text-blue-700 dark:text-blue-400' 
                    : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {conversation.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(conversation.updatedAt)}
                  </p>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {conversation.messageCount} {conversation.messageCount === 1 ? 'message' : 'messages'}
                  </p>
                  {conversation.isPinned && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                      <div className="flex items-center gap-1">
                        <Pin className="w-3 h-3 text-yellow-500 dark:text-yellow-400" />
                        <span className="text-xs text-yellow-600 dark:text-yellow-400">Pinned</span>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Menu Button */}
        {!isEditing && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className={`p-1.5 rounded-lg transition-all duration-200 ${
                showMenu 
                  ? 'bg-gray-200 dark:bg-gray-700 opacity-100' 
                  : 'opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              aria-label="Conversation options"
            >
              <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <>
                {/* Click outside handler */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                  }}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-20 overflow-hidden animate-scale-in">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPin();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {conversation.isPinned ? (
                      <>
                        <PinOff className="w-4 h-4" />
                        Unpin conversation
                      </>
                    ) : (
                      <>
                        <Pin className="w-4 h-4" />
                        Pin conversation
                      </>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Rename
                  </button>
                  <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      // Custom confirm dialog
                      if (window.confirm(`Delete "${conversation.title}"? This action cannot be undone.`)) {
                        onDelete();
                      }
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete conversation
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Active indicator bar */}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-blue-500 to-blue-600 rounded-r-full"></div>
      )}
    </div>
  );
};

export default ConversationItem;