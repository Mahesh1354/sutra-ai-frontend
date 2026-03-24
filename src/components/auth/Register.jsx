import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, UserPlus, AlertCircle, BookOpen } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/chat', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      setLoading(false);
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const result = await register(formData);
    if (result.success) {
      navigate('/chat', { replace: true });
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-orange-50 to-amber-50 dark:from-gray-950 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Preparing your thread...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-orange-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 p-4">
      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-800">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-r from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Join Sutra AI
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
            Begin your journey with the thread of knowledge
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-950/50 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name (Optional)
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full pl-9 sm:pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base transition-all"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                className="w-full pl-9 sm:pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base transition-all"
                placeholder="Choose a username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-9 sm:pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base transition-all"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full pl-9 sm:pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base transition-all"
                placeholder="Choose a password (min. 6 characters)"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-2.5 rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base shadow-md hover:shadow-lg"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Weaving your thread...
              </div>
            ) : (
              <>
                <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                Begin Your Journey
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium transition-colors">
            Weave your way back
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;