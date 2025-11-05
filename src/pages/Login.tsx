import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  LogIn, 
  User, 
  Lock, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Shield,
  BookOpen,
  GraduationCap,
  Users,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Zap
} from 'lucide-react';
import { LoadingScreen } from '../components/LoadingScreen';
import { useToast } from '../components/Toast';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { show } = useToast();

  // If already logged in, block access to login page
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  if (storedUser) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        show('Login berhasil', 'success');
        const redirectTo = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(redirectTo, { replace: true });
      } else {
        setError('Username atau password salah!');
        show('Gagal login', 'error');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  // No quick login UI to avoid revealing credentials

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Hide rotating demo credentials

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-primary-200 dark:bg-primary-900/20 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20"
        />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.3, 0],
              y: [0, -100],
              x: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear"
            }}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            {i % 3 === 0 ? (
              <Shield className="w-8 h-8 text-primary-400" />
            ) : i % 3 === 1 ? (
              <GraduationCap className="w-8 h-8 text-purple-400" />
            ) : (
              <BookOpen className="w-8 h-8 text-blue-400" />
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl mx-auto relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="inline-flex items-center gap-3 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Sistem Autentikasi
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Platform Manajemen Edukasi
                  </p>
                </div>
              </motion.div>

              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start gap-4 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-md"
                >
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                      Keamanan Terjamin
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Sistem autentikasi dengan enkripsi yang kuat untuk melindungi data Anda
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start gap-4 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-md"
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                      Multi-Role Access
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Akses sesuai peran: Admin, Guru, atau Siswa dengan fitur yang berbeda
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start gap-4 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-md"
                >
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                      Dashboard Interaktif
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Antarmuka modern dengan grafik dan statistik real-time
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-10 border border-white/20 dark:border-gray-700/50">
              {/* Header */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="text-center mb-8"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 rounded-2xl mb-4 shadow-lg"
                >
                  <LogIn className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Selamat Datang
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Masuk ke akun Anda untuk melanjutkan
                </p>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                      focusedField === 'username' ? 'text-primary-600' : 'text-gray-400'
                    }`}>
                      <User className="w-5 h-5" />
                    </div>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-all ${
                        focusedField === 'username' 
                          ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Masukkan username"
                      required
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                      focusedField === 'password' ? 'text-primary-600' : 'text-gray-400'
                    }`}>
                      <Lock className="w-5 h-5" />
                    </div>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-all ${
                        focusedField === 'password' 
                          ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Masukkan password"
                      required
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </motion.button>
                  </div>
                </motion.div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-600 via-primary-600 to-purple-600 hover:from-primary-700 hover:via-primary-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <span>Masuk</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </form>

              {/* Credentials helper removed to keep credentials private */}

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400"
              >
                <p>© 2024 Sistem Autentikasi & Otorisasi · by ridho. Hak cipta dilindungi.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
