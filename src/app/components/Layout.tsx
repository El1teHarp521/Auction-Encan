import { Outlet } from 'react-router';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-8 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Encan</h3>
              <p className="text-sm text-muted-foreground">
                Современная платформа для аукционов недвижимости
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Навигация</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>Каталог</li>
                <li>О платформе</li>
                <li>Как это работает</li>
                <li>Поддержка</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Контакты</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>support@encan.com</li>
                <li>+7 (800) 555-35-35</li>
                <li>Москва, ул. Примерная, 123</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2026 Encan. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
