import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext'; // Мозги авторизации
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Gavel } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Берем функцию входа из контекста
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // --- ЛОГИКА БЭКЕНДА (ВХОД) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Стучимся в Python, чтобы он проверил email и пароль в PostgreSQL
    const success = await login(email, password);

    if (success) {
      // Если база нашла такого юзера, идем на главную страницу
      alert("Вход выполнен успешно!");
      navigate('/');
    } else {
      // Если база не нашла (неверный пароль или email)
      alert("Неверный email или пароль. Попробуйте снова.");
    }
    
    setLoading(false);
  };
  // --- КОНЕЦ ЛОГИКИ БЭКЕНДА ---

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8 border-primary/10 shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <Gavel className="h-12 w-12 text-primary mb-4" />
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">Вход в Encan</h1>
          <p className="text-muted-foreground text-center mt-2 text-[11px] font-bold uppercase tracking-widest opacity-60">
            Войдите в свой аккаунт для продолжения
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-muted-foreground mb-2 tracking-widest">
              Ваш Email
            </label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 font-medium focus-visible:ring-primary/40"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-muted-foreground mb-2 tracking-widest">
              Пароль
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 font-medium focus-visible:ring-primary/40"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02]" 
            size="lg"
            disabled={loading}
          >
            {loading ? "ПРОВЕРКА..." : "ВОЙТИ"}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-primary/5 pt-6">
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
            Нет аккаунта?{' '}
            <Link to="/signup" className="text-primary hover:underline font-black ml-1">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}