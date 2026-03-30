import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Gavel } from 'lucide-react';

export function SignUp() {
  const navigate = useNavigate();
  const { register } = useAuth(); // Берем функцию регистрации из "мозгов" (контекста)
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // --- ЛОГИКА БЭКЕНДА НАЧИНАЕТСЯ ТУТ ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    // Это "мост" между твоим сайтом и базой в pgAdmin
    // Мы ждем (await), пока Python запишет юзера в таблицу users
    const success = await register(name, email, password);

    if (success) {
      // Если в базе всё ок, идем на страницу верификации
      navigate('/verification');
    }
  };
  // --- ЛОГИКА БЭКЕНДА ЗАКАНЧИВАЕТСЯ ТУТ ---

  // Дальше идет то, что ты назвала "HTML" (дизайн страницы)
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <Gavel className="h-12 w-12 text-primary mb-4" />
          <h1 className="text-2xl font-bold">Регистрация в Encan</h1>
          <p className="text-muted-foreground text-center mt-2">
            Создайте аккаунт для участия в аукционах
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2 font-bold uppercase text-[10px]">Имя</label>
            <Input
              type="text"
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-bold uppercase text-[10px]">Email</label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-bold uppercase text-[10px]">Пароль</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-bold uppercase text-[10px]">Подтвердите пароль</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full h-12 text-xs font-black uppercase tracking-widest" size="lg">
            Зарегистрироваться
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm font-medium">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-primary hover:underline font-bold">
              Войти
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}