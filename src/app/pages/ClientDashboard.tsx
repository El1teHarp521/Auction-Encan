import { useNavigate } from 'react-router';
import { TrendingUp, Clock, Trophy, Eye } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { mockLots } from '../types';

export function ClientDashboard() {
  const navigate = useNavigate();

  // Фильтруем лоты, в которых участвует клиент (для демо - первые 2)
  const participatingLots = mockLots.filter((_, i) => i < 2);
  const wonLots = mockLots.filter((_, i) => i === 2); // Для демо

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  const getTimeLeft = (endDate: Date) => {
    const diff = endDate.getTime() - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}д ${hours}ч`;
    return `${hours}ч`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Личный кабинет</h1>
        <p className="text-muted-foreground">Управляйте своими ставками и участием в аукционах</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Активных ставок</p>
              <p className="text-3xl font-bold">{participatingLots.length}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Выиграно аукционов</p>
              <p className="text-3xl font-bold">{wonLots.length}</p>
            </div>
            <Trophy className="h-10 w-10 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Просмотрено лотов</p>
              <p className="text-3xl font-bold">24</p>
            </div>
            <Eye className="h-10 w-10 text-primary" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Активные ставки</TabsTrigger>
          <TabsTrigger value="won">Выигранные</TabsTrigger>
          <TabsTrigger value="history">История</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {participatingLots.map((lot) => (
              <Card key={lot.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <img
                    src={lot.imageUrl}
                    alt={lot.title}
                    className="w-full md:w-48 h-48 object-cover"
                  />
                  <div className="p-5 flex-1">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{lot.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                      {lot.address}
                    </p>

                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground mb-1">Текущая цена</p>
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(lot.currentPrice)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{getTimeLeft(lot.endDate)}</span>
                      </div>
                      <Badge>Лидирую</Badge>
                    </div>

                    <Button
                      onClick={() => navigate(`/lot/${lot.id}`)}
                      className="w-full mt-4"
                      variant="outline"
                    >
                      Перейти к лоту
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="won">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wonLots.map((lot) => (
              <Card key={lot.id} className="overflow-hidden border-primary/50">
                <div className="flex flex-col md:flex-row">
                  <img
                    src={lot.imageUrl}
                    alt={lot.title}
                    className="w-full md:w-48 h-48 object-cover"
                  />
                  <div className="p-5 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      <Badge className="bg-primary">Победитель</Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{lot.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                      {lot.address}
                    </p>

                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground mb-1">Цена победы</p>
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(lot.currentPrice)}
                      </p>
                    </div>

                    <div className="bg-primary/10 p-3 rounded-lg mb-3">
                      <p className="text-sm font-medium mb-1">Контакты продавца:</p>
                      <p className="text-sm text-muted-foreground">{lot.sellerName}</p>
                      <p className="text-sm text-muted-foreground">seller@example.com</p>
                      <p className="text-sm text-muted-foreground">+7 (999) 123-45-67</p>
                    </div>

                    <Button
                      onClick={() => navigate(`/lot/${lot.id}`)}
                      className="w-full"
                    >
                      Подробнее
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="p-8 text-center">
            <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">История пуста</h3>
            <p className="text-muted-foreground mb-4">
              Здесь будут отображаться завершенные аукционы
            </p>
            <Button onClick={() => navigate('/catalog')}>
              Перейти к каталогу
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
