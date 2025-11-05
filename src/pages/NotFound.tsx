import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-6xl font-extrabold text-gray-800 dark:text-white">404</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Halaman tidak ditemukan.</p>
        <Link
          to="/dashboard"
          className="inline-block mt-6 px-5 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow hover:opacity-90"
        >
          Kembali ke Dashboard
        </Link>
      </motion.div>
    </div>
  );
};


