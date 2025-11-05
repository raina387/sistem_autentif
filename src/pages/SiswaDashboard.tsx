import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  LogOut, 
  User as UserIcon, 
  Award,
  Mail,
  GraduationCap,
  TrendingUp,
  Menu,
  X,
  Trophy,
  Target,
  TrendingDown,
  Sparkles,
  BarChart3,
  Calendar,
  Star
} from 'lucide-react';
import { DarkModeToggle } from '../components/DarkModeToggle';
import { mockStudents } from '../types';
import { useData } from '../contexts/DataContext';

export const SiswaDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { announcements, schedule } = useData();
  
  const studentData = mockStudents.find(s => s.id === user?.id);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const calculateAverage = () => {
    if (!studentData?.nilai) return 0;
    const values = Object.values(studentData.nilai).filter(v => v !== undefined) as number[];
    if (values.length === 0) return 0;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 85) return 'text-green-600 dark:text-green-400';
    if (grade >= 75) return 'text-blue-600 dark:text-blue-400';
    if (grade >= 65) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getGradeLabel = (grade: number) => {
    if (grade >= 85) return 'Sangat Baik';
    if (grade >= 75) return 'Baik';
    if (grade >= 65) return 'Cukup';
    return 'Perlu Peningkatan';
  };

  const getGradeBgColor = (grade: number) => {
    if (grade >= 85) return 'from-green-500 to-green-600';
    if (grade >= 75) return 'from-blue-500 to-blue-600';
    if (grade >= 65) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const subjects = [
    { key: 'matematika', label: 'Matematika', icon: '📐' },
    { key: 'bahasaIndonesia', label: 'Bahasa Indonesia', icon: '📝' },
    { key: 'bahasaInggris', label: 'Bahasa Inggris', icon: '🌐' },
    { key: 'ipa', label: 'Ilmu Pengetahuan Alam', icon: '🔬' },
    { key: 'ips', label: 'Ilmu Pengetahuan Sosial', icon: '🌍' },
  ];

  // Calculate statistics
  const totalSubjects = subjects.length;
  const completedSubjects = subjects.filter(s => 
    studentData?.nilai?.[s.key as keyof typeof studentData.nilai] !== undefined
  ).length;
  const excellentSubjects = subjects.filter(s => {
    const grade = studentData?.nilai?.[s.key as keyof typeof studentData.nilai] as number | undefined;
    return grade !== undefined && grade >= 85;
  }).length;
  const average = calculateAverage();
  const today = new Date();
  const visibleAnnouncements = announcements.filter(a => {
    const publish = a.publishAt ? new Date(a.publishAt) : null;
    const expires = a.expiresAt ? new Date(a.expiresAt) : null;
    return (!publish || publish <= today) && (!expires || expires >= today);
  }).slice(0,3);
  const upcoming = schedule.filter(s => new Date(s.date) >= new Date(today.toISOString().slice(0,10))).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,5);

  const exportCsv = () => {
    const header = ['Mata Pelajaran', 'Nilai'];
    const rows = subjects.map(s => [
      s.label,
      studentData?.nilai?.[s.key as keyof typeof studentData.nilai] ?? ''
    ]);
    const csv = [header, ...rows, ['', ''], ['Rata-rata', String(average)]]
      .map(r => r.map(v => `"${String(v).toString().replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nilai-saya.csv';
    a.click();
    URL.revokeObjectURL(url);
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
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 dark:text-white">Siswa Portal</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <UserIcon className="w-4 h-4" />
            <span>{user?.name}</span>
          </div>
        </div>

        <nav className="p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <UserIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span className="font-medium text-primary-700 dark:text-primary-300">Profil Saya</span>
            </div>
            <div className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Award className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">Nilai Saya</span>
            </div>
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
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Dashboard Siswa
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Pantau prestasi akademik Anda dengan mudah
            </p>
          </motion.div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className={`bg-gradient-to-br ${getGradeBgColor(average)} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Trophy className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 opacity-80" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{average}</h3>
              <p className="text-white/90 text-sm">Nilai Rata-rata</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Target className="w-6 h-6" />
                </div>
                <BarChart3 className="w-5 h-5 opacity-80" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{completedSubjects}/{totalSubjects}</h3>
              <p className="text-blue-100 text-sm">Mata Pelajaran</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Star className="w-6 h-6" />
                </div>
                <Sparkles className="w-5 h-5 opacity-80" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{excellentSubjects}</h3>
              <p className="text-yellow-100 text-sm">Nilai Sempurna</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Award className="w-6 h-6" />
                </div>
                <Calendar className="w-5 h-5 opacity-80" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{getGradeLabel(average)}</h3>
              <p className="text-purple-100 text-sm">Status Prestasi</p>
            </motion.div>
          </div>

          {/* Announcements & Upcoming */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Pengumuman</h3>
              <div className="space-y-2">
                {visibleAnnouncements.length === 0 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">Belum ada pengumuman.</div>
                )}
                {visibleAnnouncements.map(a => (
                  <div key={a.id} className="p-3 rounded-lg border dark:border-gray-700">
                    <div className="font-semibold text-gray-800 dark:text-white">{a.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{a.content}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(a.createdAt).toLocaleString('id-ID')}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Jadwal Mendatang</h3>
              <div className="space-y-2">
                {upcoming.length === 0 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">Belum ada jadwal.</div>
                )}
                {upcoming.map(s => (
                  <div key={s.id} className="p-3 rounded-lg border dark:border-gray-700">
                    <div className="font-semibold text-gray-800 dark:text-white">{s.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{s.type.toUpperCase()} • {new Date(s.date).toLocaleDateString('id-ID')} {s.kelas ? `• ${s.kelas}` : ''}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-4 lg:p-6 mb-8 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                {user?.name.charAt(0)}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  {user?.name}
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 dark:text-gray-400">
                    <GraduationCap className="w-4 h-4" />
                    <span>{studentData?.kelas || 'Kelas belum ditentukan'}</span>
                  </div>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nilai Rata-rata</div>
                <div className={`text-4xl font-bold ${getGradeColor(calculateAverage())}`}>
                  {calculateAverage()}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {getGradeLabel(calculateAverage())}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Grades Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary-600" />
              Nilai Mata Pelajaran
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject, index) => {
                const grade = studentData?.nilai?.[subject.key as keyof typeof studentData.nilai] as number | undefined;
                return (
                  <motion.div
                    key={subject.key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className={`bg-gradient-to-br ${grade !== undefined ? getGradeBgColor(grade) : 'from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800'} rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${grade !== undefined ? 'text-white' : 'text-gray-800 dark:text-white'}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">{subject.icon}</div>
                      {grade !== undefined && (
                        <div className={`text-3xl font-bold ${grade !== undefined ? 'text-white' : getGradeColor(grade)}`}>
                          {grade}
                        </div>
                      )}
                    </div>
                    <h4 className={`font-semibold mb-2 ${grade !== undefined ? 'text-white' : 'text-gray-800 dark:text-white'}`}>
                      {subject.label}
                    </h4>
                    {grade !== undefined ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${grade}%` }}
                              transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                              className="h-2 rounded-full bg-white"
                            />
                          </div>
                          <span className="text-sm font-semibold text-white/90">
                            {getGradeLabel(grade)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Belum ada nilai</p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className={`bg-gradient-to-r ${getGradeBgColor(average)} rounded-2xl shadow-xl p-6 text-white`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Ringkasan Prestasi
                </h3>
                <p className="text-white/90">
                  Tetap semangat belajar dan tingkatkan prestasi Anda!
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold mb-1">{average}</div>
                <div className="text-white/80 text-sm">Nilai Rata-rata</div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={exportCsv}
                className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white shadow"
              >
                Unduh Nilai (CSV)
              </button>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

