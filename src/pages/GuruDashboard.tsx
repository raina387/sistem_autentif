import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  LogOut, 
  User as UserIcon, 
  Users, 
  BookOpen,
  Search,
  Edit,
  Save,
  X,
  Menu,
  TrendingUp,
  Award,
  BarChart3,
  Clock,
  Target,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { DarkModeToggle } from '../components/DarkModeToggle';
import { mockStudents } from '../types';
import { useData } from '../contexts/DataContext';
import { useToast } from '../components/Toast';
import { Student } from '../types';

export const GuruDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { schedule, addSchedule, attendance, toggleAttendance } = useData();
  const { show } = useToast();
  const [addingSchedule, setAddingSchedule] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [classFilter, setClassFilter] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    setEditValues({ ...student.nilai });
  };

  const handleSave = (studentId: string) => {
    setStudents(students.map(s => 
      s.id === studentId ? { ...s, nilai: editValues } : s
    ));
    setEditingId(null);
    setEditValues({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleGradeChange = (subject: string, value: string) => {
    const numValue = value === '' ? undefined : parseInt(value);
    setEditValues({ ...editValues, [subject]: numValue });
  };

  const filteredStudents = students
    .filter(s => (classFilter === 'all' ? true : s.kelas === classFilter))
    .filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.kelas.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const exportCsv = () => {
    const header = ['Nama', 'Kelas', 'Matematika', 'B. Indonesia', 'B. Inggris', 'IPA', 'IPS', 'Rata-rata'];
    const rows = filteredStudents.map(s => [
      s.name,
      s.kelas,
      s.nilai?.matematika ?? '',
      s.nilai?.bahasaIndonesia ?? '',
      s.nilai?.bahasaInggris ?? '',
      s.nilai?.ipa ?? '',
      s.nilai?.ips ?? '',
      String(calculateAverage(s.nilai))
    ]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nilai-siswa.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const calculateAverage = (nilai: Student['nilai']) => {
    if (!nilai) return 0;
    const values = Object.values(nilai).filter(v => v !== undefined) as number[];
    if (values.length === 0) return 0;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  };

  // Calculate statistics
  const totalStudents = students.length;
  const averageGrade = Math.round(
    students.reduce((sum, s) => sum + calculateAverage(s.nilai), 0) / totalStudents
  );
  const excellentStudents = students.filter(s => calculateAverage(s.nilai) >= 85).length;
  const needsImprovement = students.filter(s => calculateAverage(s.nilai) < 75).length;
  const classes = [...new Set(students.map(s => s.kelas))];
  const todayISO = new Date().toISOString().slice(0,10);

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
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 dark:text-white">Guru Panel</h2>
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
            <span className="font-medium text-primary-700 dark:text-primary-300">Daftar Siswa</span>
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
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Manajemen Nilai Siswa
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Pantau dan kelola prestasi akademik siswa dengan mudah
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
                <h3 className="text-3xl font-bold mb-1">{totalStudents}</h3>
                <p className="text-blue-100 text-sm">Total Siswa</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Target className="w-6 h-6" />
                  </div>
                  <BarChart3 className="w-5 h-5 opacity-80" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{averageGrade}</h3>
                <p className="text-purple-100 text-sm">Rata-rata Nilai</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Award className="w-6 h-6" />
                  </div>
                  <Sparkles className="w-5 h-5 opacity-80" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{excellentStudents}</h3>
                <p className="text-green-100 text-sm">Siswa Berprestasi</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <Target className="w-5 h-5 opacity-80" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{needsImprovement}</h3>
                <p className="text-orange-100 text-sm">Perlu Bimbingan</p>
              </motion.div>
            </div>

            {/* Quick Schedule (Tasks/Exams) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Jadwal Tugas/Ujian</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setAddingSchedule(true);
                  const fd = new FormData(e.currentTarget as HTMLFormElement);
                  const title = String(fd.get('title') || '').trim();
                  const date = String(fd.get('date') || '').trim();
                  const type = String(fd.get('type') || 'tugas') as any;
                  const kelas = String(fd.get('kelas') || '').trim();
                  if (!title || !date) { setAddingSchedule(false); return; }
                  addSchedule({ title, date, type, kelas, createdBy: user?.name || 'Guru' });
                  (e.currentTarget as HTMLFormElement).reset();
                  setAddingSchedule(false);
                  show('Jadwal ditambahkan', 'success');
                }}
                className="grid md:grid-cols-5 gap-2 mb-4"
              >
                <input name="title" placeholder="Judul" className="px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                <input name="date" type="date" className="px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                <select name="type" className="px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                  <option value="tugas">Tugas</option>
                  <option value="ujian">Ujian</option>
                  <option value="rapat">Rapat</option>
                </select>
                <select name="kelas" className="px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                  <option value="">Semua Kelas</option>
                  {classes.map(k => (<option key={k} value={k}>{k}</option>))}
                </select>
                <button disabled={addingSchedule} className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-purple-600 text-white disabled:opacity-60">{addingSchedule ? 'Memproses...' : 'Tambah'}</button>
              </form>
              <div className="space-y-2 max-h-52 overflow-auto">
                {schedule.filter(s => new Date(s.date) >= new Date(todayISO)).sort((a,b)=>a.date.localeCompare(b.date)).map(s => (
                  <div key={s.id} className="p-3 rounded-lg border dark:border-gray-700 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white">{s.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{s.type.toUpperCase()} • {new Date(s.date).toLocaleDateString('id-ID')} {s.kelas ? `• ${s.kelas}` : ''}</div>
                    </div>
                  </div>
                ))}
                {schedule.length === 0 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">Belum ada jadwal.</div>
                )}
              </div>
            </motion.div>

            {/* Quick Attendance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Absensi Cepat ({todayISO})</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Nama</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Kelas</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Hadir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {students.map(s => {
                      const rec = attendance.find(r => r.id === `${todayISO}:${s.kelas}`);
                      const present = rec ? rec.presentStudentIds.includes(s.id) : false;
                      return (
                        <tr key={s.id}>
                          <td className="px-4 py-3">{s.name}</td>
                          <td className="px-4 py-3">{s.kelas}</td>
                          <td className="px-4 py-3">
                            <label className="inline-flex items-center gap-2">
                              <input type="checkbox" checked={present} onChange={()=>{ toggleAttendance(todayISO, s.kelas, s.id); show(present ? 'Tandai tidak hadir' : 'Tandai hadir', 'info'); }} />
                              <span className={`text-sm ${present ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>{present ? 'Hadir' : 'Belum'}</span>
                            </label>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                Rekap kelas hari ini: {classes.map(k => {
                  const rec = attendance.find(r => r.id === `${todayISO}:${k}`);
                  const total = students.filter(s => s.kelas === k).length;
                  const hadir = rec ? rec.presentStudentIds.length : 0;
                  return `${k}: ${hadir}/${total}`;
                }).join(' • ')}
              </div>
            </motion.div>

            {/* Performance Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Ringkasan Prestasi Siswa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="font-semibold text-gray-800 dark:text-white">Sangat Baik</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">{excellentStudents}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">siswa</span>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-gray-800 dark:text-white">Baik</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalStudents - excellentStudents - needsImprovement}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">siswa</span>
                  </div>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <span className="font-semibold text-gray-800 dark:text-white">Perlu Peningkatan</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{needsImprovement}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">siswa</span>
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
                placeholder="Cari siswa atau kelas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            >
              <option value="all">Semua Kelas</option>
              {classes.map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            <button
              onClick={exportCsv}
              className="px-4 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow hover:opacity-90"
            >
              Ekspor CSV
            </button>
          </div>

          {/* Students Table */}
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
                    <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Kelas</th>
                    <th className="hidden lg:table-cell px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Matematika</th>
                    <th className="hidden lg:table-cell px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">B. Indonesia</th>
                    <th className="hidden lg:table-cell px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">B. Inggris</th>
                    <th className="hidden xl:table-cell px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">IPA</th>
                    <th className="hidden xl:table-cell px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">IPS</th>
                    <th className="px-4 lg:px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Rata-rata</th>
                    <th className="px-4 lg:px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredStudents.map((student, index) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-800 dark:text-white block">{student.name}</span>
                            <span className="md:hidden text-xs text-gray-500 dark:text-gray-400">{student.kelas}</span>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-semibold">
                          {student.kelas}
                        </span>
                      </td>
                      {editingId === student.id ? (
                        <>
                          <td className="hidden lg:table-cell px-6 py-4">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={editValues.matematika || ''}
                              onChange={(e) => handleGradeChange('matematika', e.target.value)}
                              className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-center"
                            />
                          </td>
                          <td className="hidden lg:table-cell px-6 py-4">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={editValues.bahasaIndonesia || ''}
                              onChange={(e) => handleGradeChange('bahasaIndonesia', e.target.value)}
                              className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-center"
                            />
                          </td>
                          <td className="hidden lg:table-cell px-6 py-4">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={editValues.bahasaInggris || ''}
                              onChange={(e) => handleGradeChange('bahasaInggris', e.target.value)}
                              className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-center"
                            />
                          </td>
                          <td className="hidden xl:table-cell px-6 py-4">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={editValues.ipa || ''}
                              onChange={(e) => handleGradeChange('ipa', e.target.value)}
                              className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-center"
                            />
                          </td>
                          <td className="hidden xl:table-cell px-6 py-4">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={editValues.ips || ''}
                              onChange={(e) => handleGradeChange('ips', e.target.value)}
                              className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-center"
                            />
                          </td>
                          <td className="px-4 lg:px-6 py-4 text-center font-semibold text-gray-800 dark:text-white">
                            {calculateAverage(editValues)}
                          </td>
                          <td className="px-4 lg:px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleSave(student.id)}
                                className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30"
                              >
                                <Save className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleCancel}
                                className="p-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                              >
                                <X className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="hidden lg:table-cell px-6 py-4 text-center font-medium text-gray-800 dark:text-white">
                            {student.nilai?.matematika ?? '-'}
                          </td>
                          <td className="hidden lg:table-cell px-6 py-4 text-center font-medium text-gray-800 dark:text-white">
                            {student.nilai?.bahasaIndonesia ?? '-'}
                          </td>
                          <td className="hidden lg:table-cell px-6 py-4 text-center font-medium text-gray-800 dark:text-white">
                            {student.nilai?.bahasaInggris ?? '-'}
                          </td>
                          <td className="hidden xl:table-cell px-6 py-4 text-center font-medium text-gray-800 dark:text-white">
                            {student.nilai?.ipa ?? '-'}
                          </td>
                          <td className="hidden xl:table-cell px-6 py-4 text-center font-medium text-gray-800 dark:text-white">
                            {student.nilai?.ips ?? '-'}
                          </td>
                          <td className="px-4 lg:px-6 py-4 text-center">
                            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full text-sm font-semibold">
                              {calculateAverage(student.nilai)}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-4">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEdit(student)}
                              className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                          </td>
                        </>
                      )}
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
              Menampilkan <span className="font-semibold text-primary-600 dark:text-primary-400">{filteredStudents.length}</span> dari <span className="font-semibold text-gray-700 dark:text-gray-300">{students.length}</span> siswa
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

