import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, User, TrendingUp, Clock } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { mockLots, mockBids } from '../types';

export function LotBids() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lot = mockLots.find((l) => l.id === id);
  const bids = mockBids.filter((b) => b.lotId === id);

  if (!lot) return <div className="p-20 text-center">Лот не найден</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button variant="ghost" className="mb-6" onClick={() => navigate('/seller')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> К списку моих лотов
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="p-6 h-fit border-primary/20 shadow-lg">
          <img src={lot.imageUrl} alt="" className="w-full h-40 object-cover rounded-xl mb-4" />
          <h2 className="text-xl font-bold mb-2">{lot.title}</h2>
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Начальная цена:</span>
              <span className="font-bold">{lot.startingPrice.toLocaleString()} ₽</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Текущая цена:</span>
              <span className="font-bold text-primary text-lg">{lot.currentPrice.toLocaleString()} ₽</span>
            </div>
          </div>
          <Badge className="w-full justify-center py-2 bg-primary/10 text-primary border-none text-base">
            <TrendingUp className="mr-2 h-4 w-4" /> {bids.length} ставок
          </Badge>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold mb-4">История предложений</h2>
          {bids.map((bid, index) => (
            <Card key={bid.id} className={`p-5 flex items-center justify-between border-l-4 ${index === 0 ? 'border-l-primary bg-primary/5' : 'border-l-muted'}`}>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-primary">{bid.userName[0]}</div>
                <div>
                  <p className="font-bold">{bid.userName} {index === 0 && <Badge className="ml-2 scale-90">Лидер</Badge>}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(bid.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <p className="text-xl font-bold text-primary">{bid.amount.toLocaleString()} ₽</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}