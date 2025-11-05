import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  LogOut, 
  User as UserIcon, 
  Edit, 
  Trash2, 
  Search,
  Mail,
  Shield,
  Menu,
  X,
  TrendingUp,
  Activity,
  UserCheck,
  UserX,
  BarChart3,
  Award,
  Clock
} from 'lucide-react';
import { DarkModeToggle } from '../components/DarkModeToggle';
import { mockUsers } from '../types';
import { useData } from '../contexts/DataContext';
import { useToast } from '../components/Toast';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { announcements, addAnnouncement, removeAnnouncement } = useData();
  const { show } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(mockUsers.filter(u => u.id !== user?.id));
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'guru' | 'siswa'>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = (userId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const filteredUsers = users
    .filter(u => (roleFilter === 'all' ? true : u.role === roleFilter))
    .filter(u =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const exportCsv = () => {
    const header = ['Nama', 'Username', 'Email', 'Peran'];
    const rows = filteredUsers.map(u => [u.name, u.username, u.email ?? '', u.role]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pengguna.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg';
      case 'guru':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg';
      case 'siswa':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Calculate statistics
  const stats = {
    total: users.length + 1, // +1 for current admin
    admin: users.filter(u => u.role === 'admin').length + 1,
    guru: users.filter(u => u.role === 'guru').length,
    siswa: users.filter(u => u.role === 'siswa').length,
    active: users.length + 1,
    inactive: 0
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-40 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 dark:text-white">Admin Panel</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <UserIcon className="w-4 h-4" />
            <span>{user?.name}</span>
          </div>
        </div>

        <nav className="p-4">
          <div className="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg mb-2">
            <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <span className="font-medium text-primary-700 dark:text-primary-300">Manajemen Pengguna</span>
          </div>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <DarkModeToggle />
        </div>

        <button
          onClick={handleLogout}
          className="absolute bottom-16 left-4 right-4 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Announcements Manager */}
          <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Buat Pengumuman</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                setSubmitting(true);
                const fd = new FormData(e.currentTarget as HTMLFormElement);
                const title = String(fd.get('title') || '').trim();
                const content = String(fd.get('content') || '').trim();
                const publishAt = String(fd.get('publishAt') || '');
                const expiresAt = String(fd.get('expiresAt') || '');
                if (!title || !content) { setSubmitting(false); return; }
                addAnnouncement({ title, content, publishAt: publishAt || undefined, expiresAt: expiresAt || undefined, createdBy: user?.name || 'Admin' });
                (e.currentTarget as HTMLFormElement).reset();
                setSubmitting(false);
                show('Pengumuman dipublikasikan', 'success');
              }} className="space-y-3">
                <input name="title" placeholder="Judul" className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                <textarea name="content" placeholder="Isi pengumuman" className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input name="publishAt" type="datetime-local" className="px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                  <input name="expiresAt" type="datetime-local" className="px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
                <button disabled={submitting} className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-purple-600 text-white disabled:opacity-60">{submitting ? 'Memproses...' : 'Publikasikan'}</button>
              </form>
            </div>
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Pengumuman Terbaru</h3>
              <div className="space-y-3 max-h-72 overflow-auto">
                {announcements.length === 0 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">Belum ada pengumuman.</div>
                )}
                {announcements.map(a => {
                  const now = new Date();
                  const publish = a.publishAt ? new Date(a.publishAt) : null;
                  const expires = a.expiresAt ? new Date(a.expiresAt) : null;
                  const visible = (!publish || publish <= now) && (!expires || expires >= now);
                  return (
                    <div key={a.id} className={`p-3 rounded-lg border dark:border-gray-700 ${visible ? '' : 'opacity-60'}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold text-gray-800 dark:text-white">{a.title}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">{a.content}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Oleh {a.createdBy} • {new Date(a.createdAt).toLocaleString('id-ID')}</div>
                        </div>
                        <button onClick={() => { removeAnnouncement(a.id); show('Pengumuman dihapus', 'info'); }} className="text-red-600 text-xs hover:underline">Hapus</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Manajemen Pengguna
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Kelola data pengguna sistem dengan mudah dan efisien
              </p>
            </motion.div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Users className="w-6 h-6" />
                  </div>
                  <TrendingUp className="w-5 h-5 opacity-80" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.total}</h3>
                <p className="text-blue-100 text-sm">Total Pengguna</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Shield className="w-6 h-6" />
                  </div>
                  <Activity className="w-5 h-5 opacity-80" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.admin}</h3>
                <p className="text-red-100 text-sm">Administrator</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Award className="w-6 h-6" />
                  </div>
                  <BarChart3 className="w-5 h-5 opacity-80" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.guru}</h3>
                <p className="text-purple-100 text-sm">Guru</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <TrendingUp className="w-5 h-5 opacity-80" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.siswa}</h3>
                <p className="text-green-100 text-sm">Siswa</p>
              </motion.div>
            </div>

            {/* Role Distribution Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary-600" />
                Distribusi Peran Pengguna
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin</span>
                    <span className="text-sm font-bold text-red-600">{stats.admin}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.admin / stats.total) * 100}%` }}
                      transition={{ delay: 0.6, duration: 1 }}
                      className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Guru</span>
                    <span className="text-sm font-bold text-purple-600">{stats.guru}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.guru / stats.total) * 100}%` }}
                      transition={{ delay: 0.7, duration: 1 }}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Siswa</span>
                    <span className="text-sm font-bold text-green-600">{stats.siswa}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.siswa / stats.total) * 100}%` }}
                      transition={{ delay: 0.8, duration: 1 }}
                      className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Search & Filters */}
          <div className="mb-6 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari pengguna..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            >
              <option value="all">Semua Peran</option>
              <option value="admin">Admin</option>
              <option value="guru">Guru</option>
              <option value="siswa">Siswa</option>
            </select>
            <button
              onClick={exportCsv}
              className="px-4 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow hover:opacity-90"
            >
              Ekspor CSV
            </button>
          </div>

          {/* Users Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Nama</th>
                    <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Username</th>
                    <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Email</th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Peran</th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((u, index) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-800 dark:text-white block">{u.name}</span>
                            <span className="md:hidden text-xs text-gray-500 dark:text-gray-400">{u.username}</span>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 text-gray-600 dark:text-gray-400">{u.username}</td>
                      <td className="hidden lg:table-cell px-6 py-4 text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {u.email || '-'}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(u.role)}`}>
                          {u.role === 'admin' ? 'Admin' : u.role === 'guru' ? 'Guru' : 'Siswa'}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(u.id)}
                            className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 flex items-center justify-between flex-wrap gap-4"
          >
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Menampilkan <span className="font-semibold text-primary-600 dark:text-primary-400">{filteredUsers.length}</span> dari <span className="font-semibold text-gray-700 dark:text-gray-300">{users.length}</span> pengguna
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Terakhir diperbarui: {new Date().toLocaleTimeString('id-ID')}</span>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

