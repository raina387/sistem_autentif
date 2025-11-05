export type UserRole = 'admin' | 'guru' | 'siswa';

export interface User {
  id: string;
  username: string;
  password: string; // kept for legacy compatibility; avoid using in UI/storage
  role: UserRole;
  name: string;
  email?: string;
}

export interface Student {
  id: string;
  name: string;
  kelas: string;
  nilai?: {
    matematika?: number;
    bahasaIndonesia?: number;
    bahasaInggris?: number;
    ipa?: number;
    ips?: number;
  };
}

export interface Grade {
  studentId: string;
  studentName: string;
  kelas: string;
  matematika?: number;
  bahasaIndonesia?: number;
  bahasaInggris?: number;
  ipa?: number;
  ips?: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO string
  publishAt?: string; // ISO string
  expiresAt?: string; // ISO string
  createdBy: string; // user id or name
}

export type ScheduleItemType = 'tugas' | 'ujian' | 'rapat';

export interface ScheduleItem {
  id: string;
  title: string;
  date: string; // ISO date
  type: ScheduleItemType;
  kelas?: string;
  mapel?: string;
  createdBy: string;
}

export interface AttendanceRecord {
  id: string; // date+kelas
  date: string; // ISO date
  kelas: string;
  presentStudentIds: string[];
}

// Mock user data
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: '',
    role: 'admin',
    name: 'Administrator',
    email: 'admin@sekolah.id'
  },
  {
    id: '2',
    username: 'guru1',
    password: '',
    role: 'guru',
    name: 'Bapak Ahmad',
    email: 'ahmad@sekolah.id'
  },
  {
    id: '3',
    username: 'siswa1',
    password: '',
    role: 'siswa',
    name: 'Rudi Santoso',
    email: 'rudi@sekolah.id'
  },
  {
    id: '4',
    username: 'siswa2',
    password: '',
    role: 'siswa',
    name: 'Siti Nurhaliza',
    email: 'siti@sekolah.id'
  },
  {
    id: '5',
    username: 'siswa3',
    password: '',
    role: 'siswa',
    name: 'Budi Pratama',
    email: 'budi@sekolah.id'
  }
];

// Mock student data
export const mockStudents: Student[] = [
  {
    id: '3',
    name: 'Rudi Santoso',
    kelas: 'XII-A',
    nilai: {
      matematika: 85,
      bahasaIndonesia: 90,
      bahasaInggris: 88,
      ipa: 87,
      ips: 82
    }
  },
  {
    id: '4',
    name: 'Siti Nurhaliza',
    kelas: 'XII-A',
    nilai: {
      matematika: 92,
      bahasaIndonesia: 95,
      bahasaInggris: 90,
      ipa: 93,
      ips: 88
    }
  },
  {
    id: '5',
    name: 'Budi Pratama',
    kelas: 'XII-B',
    nilai: {
      matematika: 78,
      bahasaIndonesia: 85,
      bahasaInggris: 80,
      ipa: 82,
      ips: 85
    }
  },
  {
    id: '6',
    name: 'Ayu Lestari',
    kelas: 'XII-B',
    nilai: {
      matematika: 88,
      bahasaIndonesia: 87,
      bahasaInggris: 85,
      ipa: 90,
      ips: 86
    }
  },
  {
    id: '7',
    name: 'Doni Setiawan',
    kelas: 'XII-A',
    nilai: {
      matematika: 75,
      bahasaIndonesia: 80,
      bahasaInggris: 78,
      ipa: 79,
      ips: 81
    }
  }
];


