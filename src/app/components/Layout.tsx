import { Outlet } from 'react-router';
import { Header } from './Header';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-10 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-1">
              <h3 className="text-lg font-bold mb-3 text-primary tracking-tighter uppercase">Encan</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Современная платформа для аукционов недвижимости молодым семьям. Мы помогаем найти лучшее жилье для ваших детей.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 uppercase text-[10px] tracking-widest text-muted-foreground/80">Навигация</h4>
              <ul className="text-xs text-muted-foreground space-y-2.5">
                <li className="hover:text-primary cursor-pointer transition-colors">Каталог объектов</li>
                <li className="hover:text-primary cursor-pointer transition-colors">О платформе</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Правила участия</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Служба поддержки</li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold mb-4 uppercase text-[10px] tracking-widest text-muted-foreground/80">Контакты и информация</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ul className="text-xs text-muted-foreground space-y-3">
                  <li className="flex items-center gap-2.5">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    <a href="mailto:EncanSupport@outlook.com" className="hover:text-primary transition-colors">EncanSupport@outlook.com</a>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    <a href="tel:+79957515850" className="hover:text-primary transition-colors">+ 7 995 751 58 50</a>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span>Г.Москва, 1-й Красногвардейский пр., 15</span>
                  </li>
                </ul>
                
                <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                  <div className="flex items-center gap-2 mb-1.5 text-primary font-bold text-[10px] uppercase">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Регламент времени</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-snug">
                    Все торги и время окончания аукционов указываются по <strong>Московскому времени (МСК, UTC+3)</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t text-[10px] text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-3">
            <p>© 2026 Информационная система «Encan». Все права защищены.</p>
            <div className="flex gap-4">
              <span className="hover:text-primary cursor-pointer">Политика конфиденциальности</span>
              <span className="hover:text-primary cursor-pointer">Пользовательское соглашение</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}