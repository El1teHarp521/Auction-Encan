import { useState, useEffect } from 'react';
import { Shield, Users, Package, Check, X, FileCheck, Trash2, StopCircle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Lot } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function AdminPanel() {
  const { user } = useAuth();
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLots = async () => {
    try {
      const res = await fetch('http://localhost:8000/lots');
      if (!res.ok) throw new Error("Database error");
      const data = await res.json();
      setLots(data);
      setLoading(false);
    } catch (error) { 
      console.error(error); 
      setLoading(false);
    }
  };

  useEffect(() => { fetchLots(); }, []);

  const handleApprove = async (id: string) => {
    await fetch(`http://localhost:8000/lots/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'active' })
    });
    alert("Объект опубликован!");
    fetchLots();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить заявку?")) return;
    await fetch(`http://localhost:8000/lots/${id}`, { method: 'DELETE' });
    fetchLots();
  };

  const handleEndEarly = async (id: string) => {
    await fetch(`http://localhost:8000/lots/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'closed', endDate: new Date().toISOString() })
    });
    fetchLots();
  };

  // Фильтруем для вкладок
  const pendingLots = lots.filter(l => l.status === 'pending');
  const activeLots = lots.filter(l => l.status === 'active');

  if (loading) return <div className="p-20 text-center text-primary font-bold text-xs uppercase tracking-[0.3em]">Авторизация в Encan Admin...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-10 border-l-4 border-primary pl-6">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter">Система модерации</h1>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Администратор: <span className="text-primary font-black italic">{user?.name}</span></p>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-xl">
          <TabsTrigger value="pending" className="text-[10px] uppercase font-bold px-6">Новые заявки ({pendingLots.length})</TabsTrigger>
          <TabsTrigger value="active" className="text-[10px] uppercase font-bold px-6">Активные торги ({activeLots.length})</TabsTrigger>
          <TabsTrigger value="users" className="text-[10px] uppercase font-bold px-6">Пользователи</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="grid gap-4">
          {pendingLots.map(lot => (
            <Card key={lot.id} className="p-5 flex flex-col md:flex-row items-center gap-6 border-primary/20 bg-card/40 shadow-lg">
              <img src={lot.imageUrl} className="w-24 h-24 rounded-xl object-cover border-2 border-primary/10" />
              <div className="flex-1">
                <Badge className="mb-2 text-[8px] tracking-tighter opacity-70 uppercase">{lot.type === 'apartment' ? 'Квартира' : 'Дом'}</Badge>
                <h3 className="text-md font-black uppercase leading-tight mb-1">{lot.title}</h3>
                <p className="text-[9px] text-muted-foreground uppercase font-bold">{lot.address}</p>
                <p className="text-[10px] font-black text-primary mt-2 uppercase tracking-tighter">Старт: {lot.startingPrice.toLocaleString()} ₽</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button variant="outline" size="sm" onClick={() => handleDelete(lot.id)} className="flex-1 text-destructive border-destructive/20 h-9 text-[9px] font-black uppercase tracking-widest"><X className="h-3 w-3 mr-1"/> Отклонить</Button>
                <Button size="sm" onClick={() => handleApprove(lot.id)} className="flex-1 bg-primary hover:bg-primary/90 h-9 text-[9px] font-black uppercase tracking-widest shadow-md shadow-primary/20"><Check className="h-3 w-3 mr-1"/> Одобрить</Button>
              </div>
            </Card>
          ))}
          {pendingLots.length === 0 && (
            <div className="text-center py-20 bg-muted/5 rounded-3xl border-2 border-dashed border-primary/5">
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Очередь модерации пуста</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="grid gap-4">
          {activeLots.map(lot => (
            <Card key={lot.id} className="p-4 flex items-center gap-6 border-primary/10 opacity-80 hover:opacity-100 transition-opacity">
              <img src={lot.imageUrl} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1">
                <h3 className="text-sm font-bold uppercase">{lot.title}</h3>
                <p className="text-[9px] font-black text-primary">{lot.currentPrice.toLocaleString()} ₽ • {lot.bidsCount} ставок</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEndEarly(lot.id)} className="h-8 text-[9px] uppercase font-bold border-orange-500/30 text-orange-500"><StopCircle className="h-3 w-3 mr-1"/> Закрыть</Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(lot.id)} className="h-8 text-[9px] uppercase font-bold text-destructive border-destructive/20"><Trash2 className="h-3 w-3 mr-1"/> Удалить</Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="users">
          <Card className="p-0 overflow-hidden border-primary/10">
            <Table>
              <TableHeader className="bg-muted/50"><TableRow><TableHead className="text-[9px] uppercase font-black">Пользователь</TableHead><TableHead className="text-[9px] uppercase font-black">Документы</TableHead><TableHead className="text-right text-[9px] uppercase font-black">Управление</TableHead></TableRow></TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-xs font-bold italic">Алексей Смирнов</TableCell>
                  <TableCell><Badge variant="outline" className="text-[8px] uppercase tracking-tighter">На проверке</Badge></TableCell>
                  <TableCell className="text-right"><Button size="sm" className="h-7 text-[8px] uppercase font-black tracking-widest">Верифицировать</Button></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}