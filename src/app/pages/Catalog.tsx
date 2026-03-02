import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Search, Filter, Clock, TrendingUp, MapPin } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Lot } from '../types';

export function Catalog() {
  const navigate = useNavigate();
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('address') || '');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || 'all');

  // ЗАГРУЗКА ИЗ БЭКЭНДА
  useEffect(() => {
    fetch('http://localhost:8000/lots')
      .then(res => res.json())
      .then(data => {
        setLots(data);
        setLoading(false);
      });
  }, []);

  const filteredLots = useMemo(() => {
    return lots.filter((lot) => {
      if (lot.status !== 'active') return false;
      if (search && !lot.address.toLowerCase().includes(search.toLowerCase()) &&
          !lot.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== 'all' && lot.type !== typeFilter) return false;
      return true;
    });
  }, [lots, search, typeFilter]);

  if (loading) return <div className="p-20 text-center uppercase font-bold text-primary animate-pulse">Загрузка базы данных...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 uppercase tracking-tight">Каталог аукционных лотов</h1>

      <Card className="p-5 mb-8 border-primary/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Поиск по адресу</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <Input placeholder="Город, улица..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-10 text-sm" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Тип жилья</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все объекты</SelectItem>
                <SelectItem value="apartment">Квартира</SelectItem>
                <SelectItem value="house">Дом</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLots.map((lot) => (
          <Card key={lot.id} className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group border-primary/5" onClick={() => navigate(`/lot/${lot.id}`)}>
            <div className="relative h-44 overflow-hidden">
              <img src={lot.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <Badge className="absolute top-3 right-3">{lot.type === 'apartment' ? 'Квартира' : 'Дом'}</Badge>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-md mb-2 line-clamp-1">{lot.title}</h3>
              <div className="flex items-start gap-2 text-xs text-muted-foreground mb-4">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="line-clamp-1">{lot.address}</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-end">
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground mb-1">Текущая цена</p>
                  <p className="text-lg font-bold text-primary">{lot.currentPrice.toLocaleString()} ₽</p>
                </div>
                <Badge variant="outline" className="h-6 text-[9px]">{lot.bidsCount} ставок</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}