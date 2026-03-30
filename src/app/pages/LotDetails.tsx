import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { MapPin, Clock, TrendingUp, ArrowLeft } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { Lot, Bid } from '../types';

export function LotDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [lot, setLot] = useState<any>(null); // Временно any для гибкости
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  const loadData = async () => {
    try {
      const lotRes = await fetch(`http://127.0.0.1:8000/lots/${id}`);
      const lotData = await lotRes.json();
      setLot(lotData);

      const bidsRes = await fetch(`http://127.0.0.1:8000/bids?lotId=${id}`);
      const bidsData = await bidsRes.json();
      setBids(Array.isArray(bidsData) ? bidsData : []);
      setLoading(false);
    } catch { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [id]);

  useEffect(() => {
    if (!lot || lot.status === 'closed' || !lot.end_date) return;
    const timer = setInterval(() => {
      const diff = new Date(lot.end_date).getTime() - new Date().getTime();
      if (diff <= 0) { setCountdown(p => ({ ...p, expired: true })); clearInterval(timer); }
      else {
        setCountdown({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000),
          expired: false
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lot]);

  const handlePlaceBid = async () => {
    if (!user || !lot) return;
    const newBid = { 
        lot_id: lot.id, 
        user_id: user.id, 
        user_name: user.name, 
        amount: Number(bidAmount) 
    };
    const res = await fetch('http://127.0.0.1:8000/bids', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(newBid) 
    });
    if (res.ok) { setBidAmount(''); loadData(); alert("Ставка принята!"); }
  };

  if (loading) return <div className="p-20 text-center animate-pulse">Загрузка...</div>;
  if (!lot) return <div className="p-20 text-center">Лот не найден</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate('/catalog')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Назад
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <img src={lot.image_url} className="w-full h-[400px] object-cover" />
          </Card>
          <Card className="p-8">
            <Badge className="mb-4">{lot.type === 'apartment' ? 'Квартира' : 'Дом'}</Badge>
            <h1 className="text-3xl font-bold mb-2">{lot.title}</h1>
            <p className="text-muted-foreground flex items-center gap-2 mb-6"><MapPin className="h-4 w-4" /> {lot.address}</p>
            <div className="grid grid-cols-3 gap-4 py-6 border-y mb-6 text-center">
              <div><p className="text-xs text-muted-foreground">Площадь</p><p className="text-xl font-bold">{lot.area} м²</p></div>
              <div><p className="text-xs text-muted-foreground">Ставок</p><p className="text-xl font-bold">{lot.bids_count}</p></div>
              <div><p className="text-xs text-muted-foreground">Продавец</p><p className="text-sm font-bold truncate">{lot.seller_name}</p></div>
            </div>
            <p className="text-muted-foreground whitespace-pre-line">{lot.description}</p>
          </Card>

          <Card className="p-8">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><TrendingUp className="h-5 w-5" /> История</h2>
            <div className="space-y-3">
              {bids.map((bid, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                        {(bid.user_name || "U")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{bid.user_name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {bid.created_at ? new Date(bid.created_at).toLocaleString('ru-RU') : ''}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold">{(bid.amount || 0).toLocaleString()} ₽</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 sticky top-24">
            <p className="text-xs text-muted-foreground uppercase">Цена</p>
            <p className="text-3xl font-bold text-primary mb-6">
                {(lot.current_price || 0).toLocaleString()} ₽
            </p>
            <div className="mb-6 p-4 bg-muted rounded-lg text-center">
              <p className="text-xs font-bold mb-2">До конца:</p>
              <div className="flex justify-center gap-3 font-bold">
                <div>{countdown.days}д</div><div>{countdown.hours}ч</div><div>{countdown.minutes}м</div><div className="text-primary">{countdown.seconds}с</div>
              </div>
            </div>
            {!countdown.expired && (
              <div className="space-y-4">
                <Input type="number" placeholder="Ваша ставка" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} className="h-12" />
                <Button onClick={handlePlaceBid} className="w-full h-12 font-bold" disabled={!bidAmount}>Сделать ставку</Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}