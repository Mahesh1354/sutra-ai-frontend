import { useState, useEffect, useCallback } from 'react';
import { chatService } from '../services/api';

export const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadConversations = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await chatService.getConversations(pageNum, 20);
      
      if (pageNum === 1) {
        setConversations(response.data);
      } else {
        setConversations(prev => [...prev, ...response.data]);
      }
      
      setHasMore(response.data.length === 20);
      setPage(pageNum);
    } catch (err) {
      setError('Failed to load conversations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteConversation = useCallback(async (conversationId) => {
    try {
      await chatService.deleteConversation(conversationId);
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    } catch (err) {
      setError('Failed to delete conversation');
      throw err;
    }
  }, []);

  const renameConversation = useCallback(async (conversationId, newTitle) => {
    try {
      const response = await chatService.updateConversation(conversationId, { title: newTitle });
      setConversations(prev => prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, title: newTitle, updatedAt: response.data.updatedAt }
          : conv
      ));
    } catch (err) {
      setError('Failed to rename conversation');
      throw err;
    }
  }, []);

  const pinConversation = useCallback(async (conversationId) => {
    try {
      const response = await chatService.pinConversation(conversationId);
      setConversations(prev => {
        const updated = prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, isPinned: response.data.isPinned }
            : conv
        );
        // Sort: pinned first, then by updatedAt
        return updated.sort((a, b) => {
          if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });
      });
    } catch (err) {
      setError('Failed to pin conversation');
      throw err;
    }
  }, []);

  const clearAllHistory = useCallback(async () => {
    try {
      await chatService.clearAllHistory();
      setConversations([]);
    } catch (err) {
      setError('Failed to clear history');
      throw err;
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    loading,
    error,
    hasMore,
    loadMore: () => {
      if (hasMore && !loading) {
        loadConversations(page + 1);
      }
    },
    deleteConversation,
    renameConversation,
    pinConversation,
    clearAllHistory,
    refreshConversations: () => loadConversations(1),
  };
};