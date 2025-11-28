import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  role: 'admin' | 'user' | null; // <--- ADDED: Track role
  login: (token: string, user: User, role: 'admin' | 'user') => void; // <--- UPDATED: Accept role
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'user' | null>(null); // <--- ADDED state
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role') as 'admin' | 'user'; // <--- Read role

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole || 'user');
    }
    setLoading(false);
  }, []);

  // Update login to save role
  const login = (token: string, userData: User, userRole: 'admin' | 'user') => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', userRole); // <--- Save role
    setUser(userData);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role'); // <--- Clear role
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};