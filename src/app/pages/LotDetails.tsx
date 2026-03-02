import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { MapPin, Clock, TrendingUp, User, ArrowLeft, ShieldCheck, Trash2, StopCircle, Shield, Calendar } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { Lot, Bid } from '../types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function LotDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [lot, setLot] = useState<Lot | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  
  const [countdown, setCountdown] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0, expired: false
  });

  const loadData = async () => {
    try {
      const lotRes = await fetch(`http://127.0.0.1:8000/lots/${id}`);
      if (!lotRes.ok) throw new Error();
      const lotData = await lotRes.json();
      setLot(lotData);

      const bidsRes = await fetch(`http://127.0.0.1:8000/bids?lotId=${id}`);
      const bidsData = await bidsRes.json();
      setBids(bidsData.sort((a: any, b: any) => b.amount - a.amount));
      setLoading(false);
    } catch { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [id]);

  useEffect(() => {
    if (!lot || lot.status === 'closed') return;

    const timer = setInterval(() => {
      const end = new Date(lot.endDate).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setCountdown(prev => ({ ...prev, expired: true }));
        clearInterval(timer);
      } else {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
          expired: false
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lot]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(Math.ceil(price)) + ' ₽';
  };

  // РАСЧЕТ МИНИМАЛЬНОЙ СТАВКИ (+7%)
  const minRequiredBid = lot ? lot.currentPrice * 1.07 : 0;

  const handlePlaceBid = async () => {
    if (!user || !lot) return;
    const amount = Number(bidAmount);

    if (amount < minRequiredBid) {
      alert(`По правилам Encan минимальный шаг повышения — 7%. \nВаша ставка должна быть не менее ${formatPrice(minRequiredBid)}`);
      return;
    }

    const newBid = { 
      id: Math.random().toString(36).substr(2, 9), 
      lotId: lot.id, 
      userId: user.id, 
      userName: user.name, 
      amount, 
      timestamp: new Date().toISOString() 
    };

    await fetch('http://127.0.0.1:8000/bids', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newBid) });
    await fetch(`http://127.0.0.1:8000/lots/${lot.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPrice: amount, bidsCount: (lot.bidsCount || 0) + 1 }) });

    setBidAmount('');
    loadData();
    alert("Ставка успешно принята!");
  };

  const handleAdminDelete = async () => {
    if (!confirm("Удалить этот лот из системы?")) return;
    await fetch(`http://127.0.0.1:8000/lots/${id}`, { method: 'DELETE' });
    navigate('/catalog');
  };

  const handleAdminClose = async () => {
    if (!confirm("Закрыть торги прямо сейчас?")) return;
    await fetch(`http://127.0.0.1:8000/lots/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'closed' }) });
    loadData();
  };

  if (loading) return <div className="p-20 text-center text-primary font-bold animate-pulse text-xs uppercase tracking-widest">Загрузка данных Encan...</div>;
  if (!lot) return <div className="p-20 text-center uppercase font-bold">Лот не найден</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      {user?.isSuperAdmin && (
        <Card className="mb-6 p-3 bg-destructive/5 border-destructive/20 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-destructive font-black text-[10px] uppercase ml-2"><Shield className="h-4 w-4" /> Админ-доступ</div>
          <div className="flex gap-2">
            {lot.status !== 'closed' && <Button size="sm" onClick={handleAdminClose} variant="outline" className="h-8 text-[9px] uppercase font-black border-orange-500/40 text-orange-500"><StopCircle className="h-3 w-3 mr-1" /> Завершить сейчас</Button>}
            <Button size="sm" onClick={handleAdminDelete} variant="destructive" className="h-8 text-[9px] uppercase font-black"><Trash2 className="h-3 w-3 mr-1" /> Удалить</Button>
          </div>
        </Card>
      )}

      <Button variant="ghost" className="mb-4 h-7 text-[10px] uppercase font-bold text-muted-foreground" onClick={() => navigate('/catalog')}>
        <ArrowLeft className="mr-1 h-3 w-3" /> Назад в каталог
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-none shadow-2xl"><img src={lot.imageUrl} className="w-full h-[380px] object-cover" /></Card>
          
          <Card className="p-8 border-primary/5 shadow-sm">
            <Badge className="mb-3 text-[9px] uppercase bg-primary/10 text-primary border-none font-bold italic">{lot.type === 'apartment' ? 'Квартира' : 'Дом'}</Badge>
            <h1 className="text-2xl font-black mb-3 leading-tight">{lot.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mb-8 text-xs font-bold uppercase tracking-tighter"><MapPin className="h-4 w-4 text-primary" /> {lot.address}</div>
            
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-primary/5 mb-8 text-center">
              <div><p className="text-[9px] uppercase font-bold text-muted-foreground mb-1">Площадь</p><p className="text-lg font-black">{lot.area} м²</p></div>
              <div><p className="text-[9px] uppercase font-bold text-muted-foreground mb-1">Ставок</p><p className="text-lg font-black text-primary">{lot.bidsCount}</p></div>
              <div><p className="text-[9px] uppercase font-bold text-muted-foreground mb-1">Организатор</p><p className="text-xs font-bold truncate tracking-tight">{lot.sellerName}</p></div>
            </div>
            
            <h2 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Описание</h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{lot.description}</p>
          </Card>

          <Card className="p-8 border-primary/5 shadow-sm">
            <h2 className="text-sm font-black uppercase mb-6 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> История предложений</h2>
            <div className="space-y-3">
              {bids.map((bid, index) => (
                <div key={bid.id} className={`flex items-center justify-between p-4 rounded-xl border ${index === 0 ? 'bg-primary/5 border-primary/30 shadow-md scale-[1.01] transition-transform' : 'bg-muted/30 border-transparent opacity-80'}`}>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-background border flex items-center justify-center text-[10px] font-bold text-primary shadow-inner">{bid.userName[0]}</div>
                    <div><p className="text-sm font-bold">{bid.userName} {index === 0 && <span className="ml-1 text-[8px] bg-primary text-white px-1.5 py-0.5 rounded font-black uppercase">Лидер</span>}</p><p className="text-[9px] text-muted-foreground font-medium">{new Date(bid.timestamp).toLocaleString('ru-RU')}</p></div>
                  </div>
                  <p className="font-black text-md text-primary">{formatPrice(bid.amount)}</p>
                </div>
              ))}
              {bids.length === 0 && <p className="text-center py-10 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-2 border-dashed rounded-2xl">Торги еще не начались</p>}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 sticky top-24 border-primary/20 shadow-2xl bg-card">
            <div className="mb-8 pb-6 border-b border-primary/5">
              <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1 tracking-widest">Текущая цена</p>
              <p className="text-3xl font-black text-primary tracking-tighter">{formatPrice(lot.currentPrice)}</p>
            </div>

            {/* ТАЙМЕР С СЕКУНДАМИ */}
            <div className="mb-8 p-5 bg-primary/5 rounded-2xl border border-primary/10 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> Оставшееся время:</span>
                <Badge variant="outline" className="text-[8px] border-primary/30 text-primary">МСК</Badge>
              </div>
              
              {countdown.expired ? (
                <p className="text-center font-black text-destructive uppercase text-sm tracking-tighter">Торги завершены</p>
              ) : (
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-background/40 rounded-lg py-2"><div className="text-xl font-black text-foreground">{countdown.days}</div><div className="text-[8px] uppercase text-muted-foreground font-bold">дн</div></div>
                  <div className="bg-background/40 rounded-lg py-2"><div className="text-xl font-black text-foreground">{countdown.hours}</div><div className="text-[8px] uppercase text-muted-foreground font-bold">час</div></div>
                  <div className="bg-background/40 rounded-lg py-2"><div className="text-xl font-black text-foreground">{countdown.minutes}</div><div className="text-[8px] uppercase text-muted-foreground font-bold">мин</div></div>
                  <div className="bg-background/40 rounded-lg py-2 border border-primary/20"><div className="text-xl font-black text-primary">{countdown.seconds}</div><div className="text-[8px] uppercase text-primary font-bold">сек</div></div>
                </div>
              )}
            </div>

            {/* ПРАВИЛО 7% И СТАВКА */}
            {!countdown.expired && (user?.role === 'client' || user?.role === 'admin') && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between items-end px-1">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Предложите цену</label>
                    <span className="text-[9px] font-black text-primary uppercase italic">шаг +7%</span>
                  </div>
                  <Input 
                    type="number" 
                    placeholder={`Минимум ${formatPrice(minRequiredBid)}`} 
                    value={bidAmount} 
                    onChange={(e) => setBidAmount(e.target.value)} 
                    className="h-12 text-xl font-black border-primary/30 focus-visible:ring-primary bg-background/50 shadow-inner" 
                  />
                  <p className="text-[8px] text-muted-foreground uppercase font-bold px-1 leading-tight">
                    По регламенту Encan минимальный шаг повышения — 7%. К предложению принимаются суммы от <strong>{formatPrice(minRequiredBid)}</strong>.
                  </p>
                </div>
                <Button onClick={handlePlaceBid} className="w-full h-12 text-xs font-black uppercase tracking-[0.15em] shadow-xl shadow-primary/20 transition-all hover:brightness-110" disabled={!bidAmount}>
                  Сделать ставку
                </Button>
                <div className="flex items-center justify-center gap-2 text-[8px] text-muted-foreground uppercase font-black pt-2 tracking-widest opacity-60">
                  <ShieldCheck className="h-3 w-3 text-primary" /> Официальный регламент торгов
                </div>
              </div>
            )}

            {countdown.expired && <div className="p-4 bg-destructive/5 rounded-xl border border-destructive/10 text-center"><p className="text-[10px] font-black text-destructive uppercase tracking-widest">Прием предложений завершен</p></div>}
            
            <div className="mt-8 pt-8 border-t border-primary/5 flex items-center gap-3 opacity-90">
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black text-[10px] uppercase">{lot.sellerName[0]}</div>
              <div>
                <p className="text-xs font-black uppercase tracking-tight">{lot.sellerName}</p>
                <div className="flex items-center gap-1"><ShieldCheck className="h-2.5 w-2.5 text-primary" /><span className="text-[8px] uppercase font-bold text-muted-foreground tracking-tighter">Организатор проверен Encan</span></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}