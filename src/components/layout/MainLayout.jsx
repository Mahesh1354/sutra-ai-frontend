import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ConversationList from '../chat/ConversationList';
import ChatContainer from '../chat/ChatContainer';
import { LogOut, Menu, X, BookOpen, Moon, Sun } from 'lucide-react';

const MainLayout = () => {
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 z-30 px-4 py-3 flex items-center justify-between">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all active:scale-95"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-orange-500" />
          <h1 className="text-lg font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Sutra AI
          </h1>
        </div>
        <div className="flex gap-1">
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={closeSidebar}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative lg:block z-50 w-80 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-xl lg:shadow-none transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-linear-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    Sutra AI
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email || user?.username}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={toggleDarkMode}
                  className="hidden lg:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-gray-600" />}
                </button>
                <button
                  onClick={handleLogout}
                  className="hidden lg:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={closeSidebar}
                  className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            <ConversationList
              currentConversationId={currentConversationId}
              onSelectConversation={(id) => {
                setCurrentConversationId(id);
                closeSidebar();
              }}
              onNewChat={() => {
                setCurrentConversationId(null);
                closeSidebar();
              }}
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop Header Spacer */}
        <div className="hidden lg:block h-0" />
        
        {/* Chat Container */}
        <div className="flex-1 overflow-hidden">
          <ChatContainer
            conversationId={currentConversationId}
            onConversationChange={setCurrentConversationId}
          />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;