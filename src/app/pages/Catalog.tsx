import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Search, Filter, Clock, TrendingUp, MapPin } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { mockLots } from '../types';

export function Catalog() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('address') || '');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || 'all');
  const [priceFrom, setPriceFrom] = useState(searchParams.get('priceFrom') || '');
  const [priceTo, setPriceTo] = useState(searchParams.get('priceTo') || '');

  const filteredLots = useMemo(() => {
    return mockLots.filter((lot) => {
      if (lot.status !== 'active') return false;
      if (search && !lot.address.toLowerCase().includes(search.toLowerCase()) &&
          !lot.title.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (typeFilter !== 'all' && lot.type !== typeFilter) return false;
      if (priceFrom && lot.currentPrice < Number(priceFrom)) return false;
      if (priceTo && lot.currentPrice > Number(priceTo)) return false;
      return true;
    });
  }, [search, typeFilter, priceFrom, priceTo]);

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      apartment: 'Квартира',
      house: 'Дом',
      office: 'Офис',
    };
    return labels[type] || type;
  };

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
      <h1 className="text-3xl font-bold mb-8">Каталог лотов</h1>

      {/* Filters */}
      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label className="text-sm mb-2 block text-muted-foreground">Поиск</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Адрес или название..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="text-sm mb-2 block text-muted-foreground">Тип</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="apartment">Квартира</SelectItem>
                <SelectItem value="house">Дом</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm mb-2 block text-muted-foreground">Цена</label>
            <div className="flex gap-2">
              <Input
                placeholder="От"
                type="number"
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value)}
              />
              <Input
                placeholder="До"
                type="number"
                value={priceTo}
                onChange={(e) => setPriceTo(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground">
          Найдено: <span className="font-semibold text-foreground">{filteredLots.length}</span> лотов
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLots.map((lot) => (
          <Card
            key={lot.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => navigate(`/lot/${lot.id}`)}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={lot.imageUrl}
                alt={lot.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge className="absolute top-3 right-3 bg-primary">
                {getTypeLabel(lot.type)}
              </Badge>
            </div>

            <div className="p-5">
              <h3 className="font-semibold text-lg mb-2 line-clamp-1">{lot.title}</h3>
              
              <div className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">{lot.address}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span>{lot.area} м²</span>
                {lot.rooms && <span>• {lot.rooms} комн.</span>}
                {lot.floor && <span>• {lot.floor} этаж</span>}
              </div>

              <div className="border-t pt-3 mb-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(lot.currentPrice)}
                  </span>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Начальная: {formatPrice(lot.startingPrice)}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{getTimeLeft(lot.endDate)}</span>
                </div>
                <Badge variant="outline">{lot.bidsCount} ставок</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredLots.length === 0 && (
        <div className="text-center py-12">
          <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Лоты не найдены</h3>
          <p className="text-muted-foreground">
            Попробуйте изменить параметры поиска
          </p>
        </div>
      )}
    </div>
  );
}
