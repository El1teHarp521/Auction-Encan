import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Eye, TrendingUp, Package, Clock } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { Lot } from '../types';

export function SellerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/lots')
      .then(res => res.json())
      .then(data => {
        // Показываем только лоты текущего пользователя
        setLots(data.filter((l: Lot) => l.sellerId === user?.id));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="p-20 text-center uppercase font-bold text-primary animate-pulse text-xs">Загрузка кабинета...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight">Панель управления Encan</h1>
          <p className="text-[10px] text-muted-foreground uppercase font-bold">Ваши объекты недвижимости</p>
        </div>
        <Button onClick={() => navigate('/seller/create')} size="sm" className="text-[10px] font-bold uppercase tracking-widest px-6">
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Создать лот
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 border-primary/10">
          <p className="text-[9px] font-bold uppercase text-muted-foreground mb-1">Всего объектов</p>
          <p className="text-xl font-black">{lots.length}</p>
        </Card>
        <Card className="p-4 border-primary/10 bg-primary/5">
          <p className="text-[9px] font-bold uppercase text-primary mb-1">Активные торги</p>
          <p className="text-xl font-black text-primary">{lots.filter(l => l.status === 'active').length}</p>
        </Card>
        <Card className="p-4 border-primary/10">
          <p className="text-[9px] font-bold uppercase text-muted-foreground mb-1">На модерации</p>
          <p className="text-xl font-black">{lots.filter(l => l.status === 'pending').length}</p>
        </Card>
      </div>

      <div className="space-y-3">
        {lots.map((lot) => (
          <Card key={lot.id} className="p-4 flex flex-col md:flex-row gap-4 items-center border-primary/5 hover:border-primary/20 transition-all">
            <img src={lot.imageUrl} alt="" className="w-20 h-20 rounded-lg object-cover border" />
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-sm mb-1">{lot.title}</h3>
              <p className="text-[10px] text-muted-foreground mb-3">{lot.address}</p>
              <Badge variant={lot.status === 'active' ? 'default' : 'secondary'} className="text-[8px] uppercase tracking-tighter">
                {lot.status === 'active' ? 'В эфире' : lot.status === 'pending' ? 'На проверке' : 'Завершен'}
              </Badge>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button onClick={() => navigate(`/seller/lot/${lot.id}/bids`)} variant="outline" className="flex-1 text-[10px] font-bold uppercase h-8">Ставки ({lot.bidsCount})</Button>
              <Button onClick={() => navigate(`/lot/${lot.id}`)} className="flex-1 text-[10px] font-bold uppercase h-8 px-6">Просмотр</Button>
            </div>
          </Card>
        ))}
      </div>
      
      {lots.length === 0 && (
        <div className="text-center py-20 bg-muted/10 rounded-3xl border-2 border-dashed">
          <p className="text-xs uppercase font-bold text-muted-foreground">У вас пока нет созданных лотов</p>
        </div>
      )}
    </div>
  );
}