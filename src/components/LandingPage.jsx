import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  Sparkles, 
  Zap, 
  Shield, 
  MessageSquare, 
  Code, 
  PenTool, 
  Globe,
  ChevronRight,
  Star,
  Users,
  Clock,
  ArrowRight,
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  // If already authenticated, redirect to chat
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/chat');
    }
  }, [isAuthenticated, navigate]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const features = [
    {
      icon: MessageSquare,
      title: 'Intelligent Conversations',
      description: 'Natural, flowing conversations powered by advanced AI technology',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: Zap,
      title: 'Real-time Responses',
      description: 'Watch as responses stream in real-time, just like a human conversation',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: Code,
      title: 'Code Assistance',
      description: 'Expert programming help with syntax highlighting and explanations',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: PenTool,
      title: 'Creative Writing',
      description: 'Unleash your creativity with stories, poems, and creative ideas',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: Globe,
      title: 'Multi-language Support',
      description: 'Communicate in your preferred language with global understanding',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your conversations are secure and private',
      color: 'from-orange-500 to-amber-500'
    }
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Active Users' },
    { icon: MessageSquare, value: '1M+', label: 'Conversations' },
    { icon: Clock, value: '24/7', label: 'Availability' },
    { icon: Star, value: '4.9', label: 'User Rating' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Sutra AI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                Features
              </a>
              <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                About
              </a>
              <a href="#stats" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                Stats
              </a>
              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
              <Link
                to="/login"
                className="px-4 py-2 text-orange-600 dark:text-orange-400 font-medium hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-xl transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:scale-105 transition-transform shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4">
            <div className="container mx-auto px-4 flex flex-col gap-3">
              <a href="#features" className="py-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 transition-colors">
                Features
              </a>
              <a href="#about" className="py-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 transition-colors">
                About
              </a>
              <a href="#stats" className="py-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 transition-colors">
                Stats
              </a>
              <div className="flex gap-3 pt-2">
                <Link to="/login" className="flex-1 text-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl">
                  Sign In
                </Link>
                <Link to="/register" className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-2xl animate-pulse-slow">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent animate-gradient">
              Weaving Knowledge
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">into Every Response</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Experience the future of conversation with Sutra AI. Your intelligent assistant that understands, creates, and connects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="group px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:scale-105 transition-transform shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="px-8 py-3 border border-gray-300 dark:border-gray-700 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
            >
              Explore Features
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 bg-white/50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need for intelligent conversations, all in one place
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white/50 dark:bg-gray-900/50 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  What is Sutra?
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                The word "Sutra" (सूत्र) means thread in Sanskrit - representing the thread of knowledge that connects ideas, wisdom, and understanding.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Just as ancient wisdom was passed through sutras, our AI weaves together information, insights, and creativity to provide you with meaningful, intelligent responses.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:scale-105 transition-transform"
                >
                  Join the Journey
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur-2xl opacity-20"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Sutra AI</p>
                    <p className="text-xs text-gray-500">Weaving knowledge</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        What makes Sutra AI special?
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        It's not just an AI - it's a thread of wisdom connecting ancient knowledge with modern technology.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        How does it work?
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Powered by advanced AI, we weave together context, knowledge, and creativity for meaningful conversations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 md:p-12 text-center shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already experiencing the power of intelligent conversations.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-orange-600 rounded-xl font-medium hover:scale-105 transition-transform shadow-lg"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-gray-900 dark:text-white">Sutra AI</span>
              <span className="text-sm text-gray-500">© 2024 Weaving knowledge</span>
            </div>
            <div className="flex gap-6">
              <a href="#features" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors">
                Features
              </a>
              <a href="#about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors">
                About
              </a>
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;