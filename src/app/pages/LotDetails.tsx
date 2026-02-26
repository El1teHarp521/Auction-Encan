import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { MapPin, Clock, TrendingUp, User, Calendar, ArrowLeft } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { mockLots, mockBids } from '../types';

export function LotDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bidAmount, setBidAmount] = useState('');

  const lot = mockLots.find((l) => l.id === id);
  const bids = mockBids.filter((b) => b.lotId === id);

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

  const getTimeLeft = (endDate: Date) => {
    const diff = endDate.getTime() - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { days, hours, minutes };
  };

  const timeLeft = getTimeLeft(lot.endDate);

  const handlePlaceBid = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const amount = Number(bidAmount);
    if (amount <= lot.currentPrice) {
      alert('Ставка должна быть выше текущей цены');
      return;
    }
    alert(`Ставка ${formatPrice(amount)} успешно размещена!`);
    setBidAmount('');
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      apartment: 'Квартира',
      house: 'Дом',
    };
    return labels[type] || type;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate('/catalog')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад к каталогу
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <Card className="overflow-hidden">
            <img
              src={lot.imageUrl}
              alt={lot.title}
              className="w-full h-96 object-cover"
            />
          </Card>

          {/* Info */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="mb-2">{getTypeLabel(lot.type)}</Badge>
                <h1 className="text-3xl font-bold">{lot.title}</h1>
              </div>
            </div>

            <div className="flex items-start gap-2 text-muted-foreground mb-6">
              <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <span>{lot.address}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Площадь</p>
                <p className="font-semibold">{lot.area} м²</p>
              </div>
              {lot.rooms && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Комнат</p>
                  <p className="font-semibold">{lot.rooms}</p>
                </div>
              )}
              {lot.floor && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Этаж</p>
                  <p className="font-semibold">{lot.floor}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ставок</p>
                <p className="font-semibold">{lot.bidsCount}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Описание</h2>
              <p className="text-muted-foreground leading-relaxed">{lot.description}</p>
            </div>
          </Card>

          {/* Bid History */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">История ставок</h2>
            {bids.length > 0 ? (
              <div className="space-y-3">
                {bids.map((bid, index) => (
                  <div
                    key={bid.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      index === 0 ? 'bg-primary/10 border border-primary/20' : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{bid.userName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(bid.timestamp).toLocaleString('ru-RU')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatPrice(bid.amount)}</p>
                      {index === 0 && (
                        <Badge variant="default" className="mt-1">
                          Лидирует
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Пока нет ставок. Станьте первым!
              </p>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Auction Info */}
          <Card className="p-6 sticky top-24">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">Текущая цена</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(lot.currentPrice)}
                </span>
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Начальная: {formatPrice(lot.startingPrice)}
              </p>
            </div>

            <div className="mb-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Clock className="h-4 w-4" />
                <span>До окончания торгов:</span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 text-center">
                  <div className="text-2xl font-bold">{timeLeft.days}</div>
                  <div className="text-xs text-muted-foreground">дней</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-2xl font-bold">{timeLeft.hours}</div>
                  <div className="text-xs text-muted-foreground">часов</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                  <div className="text-xs text-muted-foreground">минут</div>
                </div>
              </div>
            </div>

            {user && user.role === 'client' && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm mb-2 block">Ваша ставка</label>
                  <Input
                    type="number"
                    placeholder={`Больше ${formatPrice(lot.currentPrice)}`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handlePlaceBid}
                  className="w-full"
                  size="lg"
                  disabled={!bidAmount}
                >
                  Сделать ставку
                </Button>
              </div>
            )}

            {!user && (
              <Button
                onClick={() => navigate('/login')}
                className="w-full"
                size="lg"
              >
                Войти для участия
              </Button>
            )}

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-2">Продавец</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{lot.sellerName}</p>
                  <p className="text-sm text-muted-foreground">Проверенный продавец</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Опубликовано: {new Date(lot.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
