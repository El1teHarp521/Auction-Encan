import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { TrendingUp, Clock, Trophy, Eye } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Lot } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function ClientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/bids?userId=${user?.id}`)
      .then(res => res.json())
      .then(data => {
        setBids(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="p-20 text-center uppercase font-bold text-primary text-xs">Загрузка ставок...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-xl font-bold uppercase mb-8">Кабинет участника</h1>
      <Card className="p-6 border-primary/10">
        <div className="flex items-center gap-4">
          <TrendingUp className="h-10 w-10 text-primary" />
          <div>
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Всего сделано предложений</p>
            <p className="text-2xl font-black text-primary">{bids.length}</p>
          </div>
        </div>
      </Card>
      
      <div className="mt-8 text-center py-20 border-2 border-dashed rounded-3xl opacity-50">
        <Clock className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
        <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest">История участия в аукционах Encan</p>
      </div>
    </div>
  );
}