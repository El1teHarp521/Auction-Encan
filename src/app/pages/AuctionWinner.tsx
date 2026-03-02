import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Trophy, Phone, Mail, MapPin, ArrowLeft, Clock } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Lot } from '../types';

export function AuctionWinner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lot, setLot] = useState<Lot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/lots/${id}`)
      .then(res => res.json())
      .then(data => {
        setLot(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-20 text-center text-primary font-bold animate-pulse text-xs uppercase">Загрузка данных победителя...</div>;

  if (!lot) return <div className="p-20 text-center uppercase font-bold text-xs">Информация о завершении не найдена</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" className="mb-6 h-7 text-[10px] uppercase font-bold" onClick={() => navigate('/dashboard')}>
        <ArrowLeft className="mr-2 h-3.5 w-3.5" /> В личный кабинет
      </Button>

      <Card className="p-10 text-center mb-8 border-primary/30 shadow-2xl bg-primary/5">
        <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">Поздравляем с победой!</h1>
        <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">Вы стали владельцем лота в системе Encan</p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6 border-primary/10">
          <h2 className="text-xs font-black uppercase tracking-widest text-primary mb-4">Объект сделки</h2>
          <img src={lot.imageUrl} alt="" className="w-full h-40 object-cover rounded-xl mb-4" />
          <h3 className="font-bold text-lg mb-2">{lot.title}</h3>
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-xs">{lot.address}</span>
          </div>
          <div className="pt-4 border-t flex justify-between items-end">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Финальная цена:</span>
            <span className="text-xl font-black text-primary">{lot.currentPrice.toLocaleString()} ₽</span>
          </div>
        </Card>

        <Card className="p-6 border-primary/10">
          <h2 className="text-xs font-black uppercase tracking-widest text-primary mb-4">Связь с организатором</h2>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-xl flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">{lot.sellerName[0]}</div>
              <div>
                <p className="font-bold text-sm">{lot.sellerName}</p>
                <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-tighter">Официальный продавец</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 border rounded-xl">
              <Phone className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold">+ 7 995 751 58 50</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 border rounded-xl">
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold">EncanSupport@outlook.com</span>
            </div>
          </div>
          <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
            <p className="text-[10px] font-bold uppercase text-primary mb-2 flex items-center gap-1.5"><Clock className="h-3 w-3" /> Следующий шаг</p>
            <p className="text-[10px] leading-relaxed text-muted-foreground italic">Свяжитесь с продавцом в течение 24 часов (по МСК) для согласования подписания договора купли-продажи.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}