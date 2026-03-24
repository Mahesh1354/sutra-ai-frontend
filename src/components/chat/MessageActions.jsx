import React, { useState } from 'react';
import { Edit2, Trash2, Copy, Check, MoreHorizontal } from 'lucide-react';

const MessageActions = ({ message, onEdit, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      {/* Menu Toggle Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title="Message actions"
        aria-label="Message actions"
      >
        <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          {/* Click outside handler */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-20 overflow-hidden min-w-35 animate-scale-in">
            <button
              onClick={() => {
                handleCopy();
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy message</span>
                </>
              )}
            </button>
            
            {onEdit && (
              <button
                onClick={() => {
                  onEdit();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit message</span>
              </button>
            )}
            
            {onDelete && (
              <>
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
                <button
                  onClick={() => {
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete message</span>
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MessageActions;