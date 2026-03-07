import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { TrendingUp, Clock, Trophy, Eye, ArrowRight, Home, Building2, MapPin } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Lot, Bid } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function ClientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userBids, setUserBids] = useState<Bid[]>([]);
  const [participatingLots, setParticipatingLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchClientData = async () => {
      try {
        // 1. Получаем все ставки данного пользователя
        const bidsRes = await fetch(`http://127.0.0.1:8000/bids?userId=${user.id}`);
        const bidsData = await bidsRes.json();
        setUserBids(bidsData);

        // 2. Получаем все лоты
        const lotsRes = await fetch('http://127.0.0.1:8000/lots');
        const lotsData = await lotsRes.json();
        
        // Фильтруем лоты
        const myLotIds = new Set(bidsData.map((b: Bid) => b.lotId));
        const myLots = lotsData.filter((l: Lot) => myLotIds.has(l.id));
        
        setParticipatingLots(myLots);
        setLoading(false);
      } catch (error) {
        console.error("Ошибка загрузки данных кабинета:", error);
        setLoading(false);
      }
    };

    fetchClientData();
  }, [user]);

  if (loading) return <div className="p-20 text-center uppercase font-bold text-primary animate-pulse text-xs tracking-widest">Загрузка профиля Encan...</div>;

  // Считаем статистику
  const activeParticipations = participatingLots.filter(l => l.status === 'active').length;
  const wonAuctions = participatingLots.filter(l => l.status === 'closed').length; // Имитация: закрытый лот = победа для простоты прототипа

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter">Личный кабинет участника</h1>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
            Пользователь: <span className="text-primary">{user?.name}</span> • Статус: Верифицирован
          </p>
        </div>
      </div>

      {/* БЛОК МЕТРИК */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <Card className="p-6 border-primary/10 bg-primary/5 flex items-center gap-5 shadow-sm">
          <div className="h-12 w-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase text-muted-foreground mb-1 tracking-widest">Активных ставок</p>
            <p className="text-2xl font-black leading-none">{activeParticipations}</p>
          </div>
        </Card>

        <Card className="p-6 border-primary/10 flex items-center gap-5 shadow-sm">
          <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase text-muted-foreground mb-1 tracking-widest">Выиграно торгов</p>
            <p className="text-2xl font-black leading-none">{wonAuctions}</p>
          </div>
        </Card>

        <Card className="p-6 border-primary/10 flex items-center gap-5 shadow-sm">
          <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Eye className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase text-muted-foreground mb-1 tracking-widest">Всего предложений</p>
            <p className="text-2xl font-black leading-none">{userBids.length}</p>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-primary/10 pb-4">
          <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
             <Home className="h-4 w-4 text-primary" /> Ваши текущие аукционы
          </h2>
        </div>

        {participatingLots.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {participatingLots.map((lot) => (
              <Card key={lot.id} className="overflow-hidden border-primary/5 hover:border-primary/20 transition-all group">
                <div className="flex flex-col md:flex-row items-center p-4 gap-6">
                  <img src={lot.imageUrl} className="w-full md:w-32 h-32 md:h-24 rounded-lg object-cover border" alt="" />
                  
                  <div className="flex-1 text-center md:text-left space-y-1">
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-1">
                      <Badge className="text-[8px] uppercase font-bold bg-primary/10 text-primary border-none">
                        {lot.type === 'apartment' ? 'Квартира' : 'Дом'}
                      </Badge>
                      {lot.status === 'active' ? (
                        <Badge variant="outline" className="text-[8px] border-primary/30 text-primary uppercase">В эфире</Badge>
                      ) : (
                        <Badge variant="destructive" className="text-[8px] uppercase">Закрыт</Badge>
                      )}
                    </div>
                    <h3 className="text-md font-bold leading-tight group-hover:text-primary transition-colors">{lot.title}</h3>
                    <p className="text-[10px] text-muted-foreground flex items-center justify-center md:justify-start gap-1 uppercase font-bold">
                      <MapPin className="h-3 w-3" /> {lot.address}
                    </p>
                  </div>

                  <div className="text-center md:text-right px-6">
                    <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">Текущая цена лота</p>
                    <p className="text-lg font-black text-primary leading-none">{lot.currentPrice.toLocaleString()} ₽</p>
                  </div>

                  <div className="w-full md:w-auto">
                    <Button onClick={() => navigate(`/lot/${lot.id}`)} size="sm" className="w-full md:w-auto h-10 text-[10px] font-black uppercase tracking-widest px-8">
                      Перейти к торгам <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-muted/10 rounded-[2rem] border-2 border-dashed border-primary/5">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest mb-6">Вы еще не принимали участие в торгах</p>
            <Button onClick={() => navigate('/catalog')} variant="outline" className="text-[10px] font-black uppercase">Перейти в каталог объектов</Button>
          </div>
        )}
      </div>

      {/* ПРАВИЛА И РЕГЛАМЕНТ */}
      <Card className="mt-12 p-6 bg-muted/30 border-none shadow-inner">
        <div className="flex items-start gap-4">
          <Clock className="h-5 w-5 text-primary shrink-0" />
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">Напоминание о регламенте</h4>
            <p className="text-[10px] leading-relaxed text-muted-foreground uppercase font-bold italic">
              Все действия, ставки и время завершения аукционов Encan фиксируются строго по Московскому времени (МСК). 
              Минимальный шаг повышения составляет 7%.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}