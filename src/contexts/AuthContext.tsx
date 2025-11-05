import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Seed demo users once for local development if not present
    const existingUsers = localStorage.getItem('users');
    if (!existingUsers) {
      const demoUsers: Array<User & { password?: string }> = [
        { id: '1', username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator', email: 'admin@sekolah.id' },
        { id: '2', username: 'guru1', password: 'guru123', role: 'guru', name: 'Bapak Ahmad', email: 'ahmad@sekolah.id' },
        { id: '3', username: 'siswa1', password: 'siswa123', role: 'siswa', name: 'Rudi Santoso', email: 'rudi@sekolah.id' },
      ];
      localStorage.setItem('users', JSON.stringify(demoUsers));
    }
    // Restore existing session without exposing sensitive data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Read credentials from localStorage (managed by the owner, not exposed in UI)
    const storedUsersRaw = localStorage.getItem('users');
    if (!storedUsersRaw) return false;
    try {
      const storedUsers: Array<User & { password?: string }> = JSON.parse(storedUsersRaw);
      const uname = username.trim().toLowerCase();
      const found = storedUsers.find(u => u.username.toLowerCase() === uname && (u as any).password === password);
      if (!found) return false;

      const { password: _omit, ...safeUser } = found as any;
      setUser(safeUser);
      localStorage.setItem('user', JSON.stringify(safeUser));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


