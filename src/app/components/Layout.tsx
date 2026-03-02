import { Outlet } from 'react-router';
import { Header } from './Header';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1"><Outlet /></main>
      <footer className="border-t py-12 bg-card/30 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-xl font-black mb-4 text-primary uppercase tracking-tighter">Encan</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Специализированная информационная система аукционов жилой недвижимости для молодых семей с детьми.
              </p>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-muted-foreground">Контакты и регламент</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <ul className="text-sm text-muted-foreground space-y-3 font-semibold">
                  <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /> EncanSupport@outlook.com</li>
                  <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /> + 7 995 751 58 50</li>
                  <li className="flex items-start gap-3"><MapPin className="h-4 w-4 text-primary mt-1 shrink-0" /> Г.Москва, 1-й Красногвардейский пр., 15</li>
                </ul>
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 shadow-sm shadow-primary/5">
                  <p className="text-xs text-primary font-black uppercase flex items-center gap-2 mb-2"><Clock className="h-4 w-4" /> Временной пояс</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Все торговые сессии и время закрытия лотов на платформе Encan функционируют по <strong>Московскому времени (МСК, UTC+3)</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-xs font-bold text-muted-foreground text-center uppercase tracking-widest">
            © 2026 ИНФОРМАЦИОННАЯ СИСТЕМА «ENCAN». ВСЕ ПРАВА ЗАЩИЩЕНЫ.
          </div>
        </div>
      </footer>
    </div>
  );
}