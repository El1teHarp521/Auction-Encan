import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, User, TrendingUp, Clock } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Lot, Bid } from '../types';

export function LotBids() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [lot, setLot] = useState<Lot | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  // ЗАГРУЗКА ДАННЫХ ИЗ БАЗЫ
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загружаем лот
        const lotRes = await fetch(`http://localhost:8000/lots/${id}`);
        if (!lotRes.ok) throw new Error();
        const lotData = await lotRes.json();
        setLot(lotData);

        // Загружаем все ставки для этого лота
        const bidsRes = await fetch(`http://localhost:8000/bids?lotId=${id}`);
        const bidsData = await bidsRes.json();
        // Сортируем: новые ставки сверху
        setBids(bidsData.sort((a: Bid, b: Bid) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  if (loading) return <div className="p-20 text-center text-primary font-bold animate-pulse text-xs uppercase tracking-widest">Загрузка данных торгов...</div>;
  if (!lot) return <div className="p-20 text-center text-xs uppercase font-bold">Лот не найден в базе данных</div>;

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <Button 
        variant="ghost" 
        className="mb-4 h-7 text-[10px] uppercase font-bold text-muted-foreground" 
        onClick={() => navigate('/seller')}
      >
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> К списку моих лотов
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Краткая инфо карточка */}
        <Card className="p-5 h-fit border-primary/20 shadow-md">
          <img src={lot.imageUrl} alt="" className="w-full h-32 object-cover rounded-lg mb-4 border" />
          <h2 className="text-md font-bold mb-2 leading-tight">{lot.title}</h2>
          <div className="space-y-2 mb-4 border-t pt-3">
            <div className="flex justify-between text-[10px]">
              <span className="text-muted-foreground uppercase font-bold">Старт:</span>
              <span className="font-bold">{formatPrice(lot.startingPrice)}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-muted-foreground uppercase font-bold">Текущая:</span>
              <span className="font-bold text-primary">{formatPrice(lot.currentPrice)}</span>
            </div>
          </div>
          <Badge className="w-full justify-center py-1.5 bg-primary/10 text-primary border-none text-[10px] font-black uppercase">
            <TrendingUp className="mr-1.5 h-3.5 w-3.5" /> {bids.length} предложений
          </Badge>
        </Card>

        {/* Список ставок */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">История всех ставок</h2>
          
          {bids.length > 0 ? (
            bids.map((bid: Bid, index: number) => (
              <Card 
                key={bid.id} 
                className={`p-4 flex items-center justify-between border-l-4 transition-all ${
                  index === 0 ? 'border-l-primary bg-primary/5 shadow-sm' : 'border-l-muted bg-card'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center font-bold text-primary text-[10px]">
                    {bid.userName[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-sm">
                      {bid.userName} 
                      {index === 0 && <span className="ml-2 text-[8px] bg-primary text-white px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">Лидер</span>}
                    </p>
                    <p className="text-[9px] text-muted-foreground flex items-center gap-1 uppercase font-medium">
                      <Clock className="h-2.5 w-2.5" /> {new Date(bid.timestamp).toLocaleString('ru-RU')}
                    </p>
                  </div>
                </div>
                <p className="text-md font-black text-primary">{formatPrice(bid.amount)}</p>
              </Card>
            ))
          ) : (
            <div className="text-center py-16 bg-muted/20 rounded-2xl border-2 border-dashed border-primary/10">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">На данный лот еще не было ставок</p>
            </div>
          )}

          {bids.length > 0 && (
            <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <h3 className="text-[9px] font-black uppercase text-primary mb-3 tracking-widest">Аналитика лота</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[8px] uppercase font-bold text-muted-foreground mb-0.5">Средний шаг</p>
                  <p className="text-sm font-bold">
                    {formatPrice(Math.round((lot.currentPrice - lot.startingPrice) / bids.length))}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] uppercase font-bold text-muted-foreground mb-0.5">Всего прирост</p>
                  <p className="text-sm font-bold text-primary">
                    +{formatPrice(lot.currentPrice - lot.startingPrice)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}