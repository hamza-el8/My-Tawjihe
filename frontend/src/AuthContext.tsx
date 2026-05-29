import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getStoredUser, isAuthenticated, logout as apiLogout, login as apiLogin, register as apiRegister } from './api';
import type { Lang } from './types';

export interface UserData {
  id: number;
  email: string;
  nom: string;
  role: 'eleve' | 'parent' | 'professeur' | 'admin';
  filiere?: string;
  niveau?: string;
  ville?: string;
  specialite?: string;
  eleveId?: number;
}

interface AuthContextType {
  user: UserData | null;
  loggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Record<string, any>) => Promise<void>;
  logout: () => void;
  language: Lang;
  setLanguage: (l: Lang) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(getStoredUser());
  const [language, setLanguage] = useState<Lang>('fr');

  const loggedIn = isAuthenticated() && !!user;

  const login = async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    setUser(data.user);
  };

  const register = async (data: Record<string, any>) => {
    await apiRegister(data);
    // Registration doesn't auto-login — user must log in separately
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <AuthContext.Provider value={{ user, loggedIn, login, register, logout, language, setLanguage }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
