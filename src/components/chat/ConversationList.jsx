import React, { useState, useEffect } from 'react';
import { useConversations } from '../../hooks/useConversations';
import ConversationItem from './ConversationItem';
import { Plus, Trash2, Loader, Search, X, MessageSquarePlus } from 'lucide-react';

const ConversationList = ({ currentConversationId, onSelectConversation, onNewChat }) => {
  const { 
    conversations, 
    loading, 
    hasMore, 
    loadMore,
    deleteConversation,
    renameConversation,
    pinConversation,
    clearAllHistory,
  } = useConversations();
  
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState([]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = conversations.filter(conv => 
        conv.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations]);

  const handleClearAll = async () => {
    await clearAllHistory();
    setShowClearConfirm(false);
    onNewChat();
  };

  const displayConversations = searchQuery ? filteredConversations : conversations;
  
  // Separate pinned and unpinned conversations
  const pinnedConversations = displayConversations.filter(conv => conv.isPinned);
  const unpinnedConversations = displayConversations.filter(conv => !conv.isPinned);

  if (loading && conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* New Chat Button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-98 shadow-md hover:shadow-lg"
        >
          <MessageSquarePlus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-8 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {displayConversations.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
              <MessageSquarePlus className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {searchQuery ? 'Try a different search term' : 'Start a new chat to begin'}
            </p>
          </div>
        ) : (
          <>
            {/* Pinned Conversations */}
            {pinnedConversations.length > 0 && (
              <div className="mb-2">
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Pinned
                  </p>
                </div>
                {pinnedConversations.map(conversation => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isActive={currentConversationId === conversation.id}
                    onSelect={() => onSelectConversation(conversation.id)}
                    onDelete={() => deleteConversation(conversation.id)}
                    onRename={(newTitle) => renameConversation(conversation.id, newTitle)}
                    onPin={() => pinConversation(conversation.id)}
                  />
                ))}
              </div>
            )}

            {/* Recent Conversations */}
            {unpinnedConversations.length > 0 && (
              <div>
                {pinnedConversations.length > 0 && (
                  <div className="px-4 py-2">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Recent
                    </p>
                  </div>
                )}
                {unpinnedConversations.map(conversation => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isActive={currentConversationId === conversation.id}
                    onSelect={() => onSelectConversation(conversation.id)}
                    onDelete={() => deleteConversation(conversation.id)}
                    onRename={(newTitle) => renameConversation(conversation.id, newTitle)}
                    onPin={() => pinConversation(conversation.id)}
                  />
                ))}
              </div>
            )}
            
            {/* Load More Button */}
            {hasMore && (
              <div className="p-4">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="w-full text-center py-2 text-sm text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load more conversations'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Actions */}
      {conversations.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full flex items-center justify-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Clear All History
          </button>
        </div>
      )}

      {/* Clear History Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full animate-scale-in">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Clear All History?
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This action cannot be undone. All conversations will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleClearAll}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-medium transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationList;