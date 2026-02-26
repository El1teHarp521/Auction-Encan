import { useParams, useNavigate } from 'react-router';
import { Trophy, Phone, Mail, MapPin, ArrowLeft } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { mockLots } from '../types';

export function AuctionWinner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lot = mockLots.find((l) => l.id === id);

  if (!lot) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Лот не найден</p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Вернуться в личный кабинет
      </Button>

      <Card className="p-8 text-center mb-8 border-primary/50">
        <Trophy className="h-20 w-20 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Поздравляем с победой!</h1>
        <p className="text-muted-foreground text-lg">
          Вы выиграли аукцион
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Lot Info */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Информация об объекте</h2>
          <img
            src={lot.imageUrl}
            alt={lot.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3 className="font-semibold text-lg mb-2">{lot.title}</h3>
          <div className="flex items-start gap-2 text-muted-foreground mb-4">
            <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <span>{lot.address}</span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Площадь:</span>
              <span className="font-semibold">{lot.area} м²</span>
            </div>
            {lot.rooms && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Комнат:</span>
                <span className="font-semibold">{lot.rooms}</span>
              </div>
            )}
            {lot.floor && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Этаж:</span>
                <span className="font-semibold">{lot.floor}</span>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground">Цена победы:</span>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(lot.currentPrice)}
              </span>
            </div>
          </div>
        </Card>

        {/* Seller Contacts */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Контакты продавца</h2>
          <p className="text-muted-foreground mb-6">
            Свяжитесь с продавцом для оформления сделки
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-semibold">
                  {lot.sellerName.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold mb-1">{lot.sellerName}</p>
                <p className="text-sm text-muted-foreground">Проверенный продавец</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Phone className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Телефон</p>
                <p className="font-semibold">+7 (999) 123-45-67</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Mail className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-semibold">seller@example.com</p>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Следующие шаги</h3>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Свяжитесь с продавцом в течение 24 часов</li>
              <li>Договоритесь о встрече и осмотре объекта</li>
              <li>Подготовьте необходимые документы для сделки</li>
              <li>Проведите оплату согласно договоренности</li>
            </ol>
          </div>

          <div className="flex gap-3 mt-6">
            <Button className="flex-1">
              <Phone className="mr-2 h-4 w-4" />
              Позвонить
            </Button>
            <Button variant="outline" className="flex-1">
              <Mail className="mr-2 h-4 w-4" />
              Написать
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-6 mt-8 bg-muted/50">
        <h3 className="font-semibold mb-2">Важная информация</h3>
        <p className="text-sm text-muted-foreground">
          Платформа Encan не участвует в финансовых расчетах между покупателем и продавцом.
          Все условия сделки обсуждаются напрямую. Будьте внимательны при оформлении документов
          и проверяйте юридическую чистоту объекта.
        </p>
      </Card>
    </div>
  );
}
