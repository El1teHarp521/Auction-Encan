import { Link, useNavigate } from 'react-router';
import { Moon, Sun, LogOut, User, Gavel, Settings, Shield, Plus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, setUserRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin': return '/admin';
      case 'seller': return '/seller';
      default: return '/dashboard';
    }
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Gavel className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold tracking-tight uppercase">Encan</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/catalog" className="text-sm font-semibold uppercase hover:text-primary transition-colors">Каталог</Link>
            {(user?.role === 'seller' || user?.role === 'admin') && (
              <Link to="/seller/create" className="text-sm font-semibold uppercase flex items-center gap-1.5 text-primary hover:opacity-80">
                <Plus className="h-4 w-4" /> Создать лот
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-sm font-semibold uppercase text-destructive hover:opacity-80">Админ-панель</Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full w-9 h-9">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-10 w-10 rounded-full p-0 border-primary/30 hover:bg-primary/5">
                    <User className="h-5 w-5 text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2">
                  <div className="px-2 py-2 mb-1">
                    <p className="font-bold text-sm truncate">{user.name}</p>
                    <Badge variant="secondary" className="mt-1 bg-primary/10 text-primary border-none text-[9px] uppercase">
                      {user.role}
                    </Badge>
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={() => navigate(getDashboardPath())} className="cursor-pointer font-bold text-xs uppercase py-2">
                    <Settings className="mr-2 h-4 w-4" /> Личный кабинет
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  
                  <div className="p-1.5 space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground px-1 mb-1 tracking-widest">Интерфейс</p>
                    <Button variant={user.role === 'client' ? 'default' : 'ghost'} size="sm" onClick={() => setUserRole('client')} className="w-full justify-start h-8 text-[10px] uppercase font-bold">Клиент</Button>
                    {(user.isSuperAdmin || user.role === 'seller') && (
                      <Button variant={user.role === 'seller' ? 'default' : 'ghost'} size="sm" onClick={() => setUserRole('seller')} className="w-full justify-start h-8 text-[10px] uppercase font-bold">Продавец</Button>
                    )}
                    {user.isSuperAdmin && (
                      <Button variant={user.role === 'admin' ? 'default' : 'ghost'} size="sm" onClick={() => setUserRole('admin')} className="w-full justify-start h-8 text-[10px] uppercase font-bold">Администратор</Button>
                    )}
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive text-xs uppercase font-bold py-2 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /> Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-wider" onClick={() => navigate('/login')}>Войти</Button>
                <Button size="sm" className="text-xs font-bold uppercase tracking-wider px-5" onClick={() => navigate('/signup')}>Регистрация</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}