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
      <footer className="border-t py-12 bg-card/30 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-20">
            
            {/* БЛОК 1: О системе */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-primary uppercase tracking-tighter italic">Encan</h3>
              <p className="text-[11px] leading-relaxed text-muted-foreground font-medium max-w-xs">
                Специализированная информационная система аукционов жилой недвижимости для молодых семей с детьми. Мы помогаем найти дом вашей мечты.
              </p>
            </div>
            
            {/* БЛОК 2: Контакты */}
            <div className="space-y-5">
              <h4 className="font-black uppercase text-[10px] tracking-[0.2em] text-muted-foreground/80">Контакты и регламент</h4>
              <ul className="text-xs text-muted-foreground space-y-3 font-bold uppercase tracking-tight">
                <li className="flex items-center gap-3 group">
                  <Mail className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                  <a href="mailto:EncanSupport@outlook.com" className="hover:text-primary transition-colors">EncanSupport@outlook.com</a>
                </li>
                <li className="flex items-center gap-3 group">
                  <Phone className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                  <a href="tel:+79957515850" className="hover:text-primary transition-colors">+ 7 995 751 58 50</a>
                </li>
                <li className="flex items-start gap-3 group">
                  <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="leading-tight">Г.Москва, 1-й Красногвардейский пр., 15</span>
                </li>
              </ul>
            </div>

            {/* БЛОК 3: Временной пояс */}
            <div className="flex items-start">
              <div className="bg-primary/5 p-5 rounded-2xl border border-primary/20 shadow-sm w-full">
                <div className="flex items-center gap-2.5 mb-3 text-primary font-black text-[10px] uppercase tracking-widest">
                  <Clock className="h-4 w-4" />
                  <span>Временной пояс</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Все торговые сессии и время закрытия лотов на платформе Encan функционируют строго по <strong className="text-foreground">Московскому времени (МСК, UTC+3)</strong>.
                </p>
              </div>
            </div>

          </div>
          
          {/* НИЖНЯЯ ПАНЕЛЬ */}
          <div className="mt-12 pt-8 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
              © 2026 ИНФОРМАЦИОННАЯ СИСТЕМА «ENCAN». ВСЕ ПРАВА ЗАЩИЩЕНЫ.
            </p>
            <div className="flex gap-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/80">
              <span className="hover:text-primary cursor-pointer transition-colors">Политика</span>
              <span className="hover:text-primary cursor-pointer transition-colors">Соглашение</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}