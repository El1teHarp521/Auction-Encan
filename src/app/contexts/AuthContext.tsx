import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'client' | 'seller' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  verified: boolean;
  isSuperAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (name: string, email: string, password: string) => void;
  setUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    // ЕДИНСТВЕННЫЙ АДМИН - АРТЕМ
    if (email === 'El1teHarp@gmail.com' && password === 'Sklob4201031!') {
      setUser({
        id: 'admin-artem',
        name: 'El1teHarp (Артем)',
        email: 'El1teHarp@gmail.com',
        role: 'admin',
        verified: true,
        isSuperAdmin: true
      });
      return;
    }

    // Все остальные по умолчанию заходят как клиенты
    setUser({
      id: 'user-' + Math.random(),
      name: email.split('@')[0],
      email,
      role: 'client',
      verified: true,
    });
  };

  const logout = () => setUser(null);

  const register = (name: string, email: string, password: string) => {
    setUser({ id: Math.random().toString(), name, email, role: 'client', verified: false });
  };

  const setUserRole = (role: UserRole) => {
    if (!user) return;
    
    // Запрет: Обычный юзер не может стать админом через HUD
    if (role === 'admin' && !user.isSuperAdmin) {
      alert("Доступ запрещен");
      return;
    }

    setUser({ ...user, role });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};