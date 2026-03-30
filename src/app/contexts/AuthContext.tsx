import React, { createContext, useContext, useState, useEffect } from 'react';

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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  setUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Загружаем юзера из памяти при открытии сайта
  useEffect(() => {
    const saved = localStorage.getItem('encan_auth');
    if (saved) setUser(JSON.parse(saved));
  }, []);

const login = async (email: string, password: string): Promise<boolean> => {
    // 1. ЗАПАСНОЙ ВХОД (Режим Артема)
    // Оставляем его на случай, если база данных упадет или не ответит
    if (email === 'El1teHarp@gmail.com' && password === 'Sklob4201031!') {
      const admin: User = { 
        id: 'admin-fallback', 
        name: 'Артем (Encan Founder)', 
        email, 
        role: 'admin', 
        verified: true, 
        isSuperAdmin: true 
      };
      setUser(admin);
      localStorage.setItem('encan_auth', JSON.stringify(admin));
      return true;
    }

    try {
      // 2. ОБЫЧНЫЙ ВХОД ЧЕРЕЗ БАЗУ ДАННЫХ
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const err = await response.json();
        alert(err.detail || "Неверный вход");
        return false;
      }

      const dbUser = await response.json();
      
      // СОЗДАЕМ ОБЪЕКТ ЮЗЕРА, КОТОРЫЙ СЛУШАЕТ ПИЩУ ИЗ БАЗЫ
      const newUser: User = {
        id: dbUser.id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        // ТУТ МАГИЯ: Берем роль, которую прислал Python из PostgreSQL
        role: (dbUser.role as UserRole) || 'client', 
        verified: true,
        // Если в базе написано 'admin', даем права супер-админа
        isSuperAdmin: dbUser.role === 'admin' 
      };
      
      setUser(newUser);
      // Сохраняем в память браузера, чтобы при F5 не вылетало
      localStorage.setItem('encan_auth', JSON.stringify(newUser));
      return true;

    } catch (error) {
      alert("Сервер бэкенда (main.py) не отвечает!");
      return false;
    }
  };

  // ФУНКЦИЯ РЕГИСТРАЦИИ
  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    try {
      const response = await fetch('http://127.0.0.1:8000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, pass })
      });

      if (!response.ok) {
        const err = await response.json();
        alert(err.detail);
        return false;
      }

      alert("Регистрация успешна! Войдите в аккаунт.");
      return true;
    } catch (error) {
      alert("Ошибка сети");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('encan_auth');
  };

  const setUserRole = (role: UserRole) => {
    if (user) setUser({ ...user, role });
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