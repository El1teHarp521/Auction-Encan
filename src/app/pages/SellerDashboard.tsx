import { useNavigate } from 'react-router';
import { Plus, Eye, TrendingUp, Package, Clock } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { mockLots } from '../types';

export function SellerDashboard() {
  const navigate = useNavigate();

  // Фильтруем лоты продавца (для демо)
  const myLots = mockLots.filter((lot) => lot.sellerId === '1' || lot.sellerId === '2');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
      active: { label: 'Активный', variant: 'default' },
      pending: { label: 'На модерации', variant: 'secondary' },
      closed: { label: 'Завершен', variant: 'outline' },
      rejected: { label: 'Отклонен', variant: 'destructive' },
    };
    const { label, variant } = config[status] || { label: status, variant: 'outline' as const };
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Панель продавца</h1>
          <p className="text-muted-foreground">Управляйте своими объектами недвижимости</p>
        </div>
        <Button onClick={() => navigate('/seller/create')} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Создать лот
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Всего лотов</p>
              <p className="text-3xl font-bold">{myLots.length}</p>
            </div>
            <Package className="h-10 w-10 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Активных</p>
              <p className="text-3xl font-bold">
                {myLots.filter((l) => l.status === 'active').length}
              </p>
            </div>
            <TrendingUp className="h-10 w-10 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">На модерации</p>
              <p className="text-3xl font-bold">
                {myLots.filter((l) => l.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-10 w-10 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Просмотров</p>
              <p className="text-3xl font-bold">1,248</p>
            </div>
            <Eye className="h-10 w-10 text-primary" />
          </div>
        </Card>
      </div>

      {/* Lots Table */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Мои лоты</h2>
        <div className="space-y-4">
          {myLots.map((lot) => (
            <Card key={lot.id} className="p-5 hover:border-primary/50 transition-colors">
              <div className="flex flex-col md:flex-row gap-4">
                <img
                  src={lot.imageUrl}
                  alt={lot.title}
                  className="w-full md:w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{lot.title}</h3>
                      <p className="text-sm text-muted-foreground">{lot.address}</p>
                    </div>
                    {getStatusBadge(lot.status)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Текущая цена</p>
                      <p className="font-semibold text-primary">
                        {formatPrice(lot.currentPrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Начальная цена</p>
                      <p className="font-semibold">{formatPrice(lot.startingPrice)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Ставок</p>
                      <p className="font-semibold">{lot.bidsCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Площадь</p>
                      <p className="font-semibold">{lot.area} м²</p>
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col gap-2">
                  <Button
                    onClick={() => navigate(`/lot/${lot.id}`)}
                    variant="outline"
                    className="flex-1 md:flex-none"
                  >
                    Просмотр
                  </Button>
                  <Button
                    onClick={() => navigate(`/seller/lot/${lot.id}/bids`)}
                    className="flex-1 md:flex-none"
                  >
                    Ставки ({lot.bidsCount})
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {myLots.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Нет лотов</h3>
            <p className="text-muted-foreground mb-4">
              Создайте свой первый лот для начала продаж
            </p>
            <Button onClick={() => navigate('/seller/create')}>
              <Plus className="mr-2 h-4 w-4" />
              Создать лот
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
