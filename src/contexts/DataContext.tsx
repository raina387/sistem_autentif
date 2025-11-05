import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Announcement, ScheduleItem, AttendanceRecord } from '../types';

interface DataContextType {
  announcements: Announcement[];
  addAnnouncement: (a: Omit<Announcement, 'id' | 'createdAt'>) => void;
  removeAnnouncement: (id: string) => void;
  schedule: ScheduleItem[];
  addSchedule: (s: Omit<ScheduleItem, 'id'>) => void;
  attendance: AttendanceRecord[];
  toggleAttendance: (dateISO: string, kelas: string, studentId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const LS_KEYS = {
  announcements: 'announcements',
  schedule: 'schedule',
  attendance: 'attendance'
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const raw = localStorage.getItem(LS_KEYS.announcements);
    return raw ? JSON.parse(raw) : [];
  });
  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    const raw = localStorage.getItem(LS_KEYS.schedule);
    return raw ? JSON.parse(raw) : [];
  });
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const raw = localStorage.getItem(LS_KEYS.attendance);
    return raw ? JSON.parse(raw) : [];
  });

  useEffect(() => {
    localStorage.setItem(LS_KEYS.announcements, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.schedule, JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.attendance, JSON.stringify(attendance));
  }, [attendance]);

  const addAnnouncement: DataContextType['addAnnouncement'] = (a) => {
    const item: Announcement = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...a
    };
    setAnnouncements(prev => [item, ...prev]);
  };

  const removeAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(x => x.id !== id));
  };

  const addSchedule: DataContextType['addSchedule'] = (s) => {
    const item: ScheduleItem = { id: crypto.randomUUID(), ...s };
    setSchedule(prev => [item, ...prev]);
  };

  const toggleAttendance: DataContextType['toggleAttendance'] = (dateISO, kelas, studentId) => {
    setAttendance(prev => {
      const id = `${dateISO}:${kelas}`;
      const found = prev.find(r => r.id === id);
      if (!found) {
        return [...prev, { id, date: dateISO, kelas, presentStudentIds: [studentId] }];
      }
      const present = new Set(found.presentStudentIds);
      if (present.has(studentId)) present.delete(studentId); else present.add(studentId);
      return prev.map(r => r.id === id ? { ...r, presentStudentIds: Array.from(present) } : r);
    });
  };

  return (
    <DataContext.Provider value={{ announcements, addAnnouncement, removeAnnouncement, schedule, addSchedule, attendance, toggleAttendance }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};


