import { useState, useEffect } from 'react';
import { Shield, Check, X, Trash2, StopCircle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Lot } from '../types';
import { useAuth } from '../contexts/AuthContext';

// ПУНКТ 1: Описываем тип пользователя, чтобы убрать "красные черточки"
interface DBUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export function AdminPanel() {
  const { user } = useAuth();
  const [lots, setLots] = useState<Lot[]>([]);
  
  // ИСПРАВЛЕНО: Теперь стейт знает про DBUser
  const [users, setUsers] = useState<DBUser[]>([]);
  const [loading, setLoading] = useState(true);

const fetchData = async () => {
    try {
      // ДОБАВЛЯЕМ ?all=true в конец ссылки
      const [lotsRes, usersRes] = await Promise.all([
        fetch('http://localhost:8000/lots?all=true'), 
        fetch('http://localhost:8000/admin/users')
      ]);
      
      const lotsData = await lotsRes.json();
      const usersData = await usersRes.json();
      
      setLots(lotsData);
      setUsers(usersData);
      setLoading(false);
    } catch (error) { 
      console.error(error); 
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id: number) => {
    await fetch(`http://localhost:8000/lots/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'active' })
    });
    alert("Объект опубликован!");
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить лот?")) return;
    await fetch(`http://localhost:8000/lots/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleMakeAdmin = async (userId: number) => {
    if (!confirm("Назначить пользователя АДМИНИСТРАТОРОМ?")) return;
    await fetch(`http://localhost:8000/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'admin' })
    });
    alert("Пользователь теперь АДМИН!");
    fetchData();
  };

  const handleMakeSeller = async (userId: number) => {
    await fetch(`http://localhost:8000/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'seller' })
    });
    alert("Пользователь теперь Продавец!");
    fetchData();
  };

  const pendingLots = lots.filter(l => l.status === 'pending');
  const activeLots = lots.filter(l => l.status === 'active');

  if (loading) return <div className="p-20 text-center animate-pulse uppercase font-black">Загрузка Encan Admin...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-10 border-l-4 border-primary pl-6">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter">Система модерации</h1>
          <p className="text-[10px] text-muted-foreground font-bold uppercase">Админ: <span className="text-primary">{user?.name}</span></p>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-xl">
          <TabsTrigger value="pending" className="text-[10px] uppercase font-bold px-6">Заявки ({pendingLots.length})</TabsTrigger>
          <TabsTrigger value="active" className="text-[10px] uppercase font-bold px-6">Активные ({activeLots.length})</TabsTrigger>
          <TabsTrigger value="users" className="text-[10px] uppercase font-bold px-6">Пользователи</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="grid gap-4">
          {pendingLots.map(lot => (
            <Card key={lot.id} className="p-5 flex flex-col md:flex-row items-center gap-6 border-primary/20">
              <img src={lot.imageUrl} className="w-24 h-24 rounded-xl object-cover" />
              <div className="flex-1">
                <h3 className="font-black uppercase text-sm">{lot.title}</h3>
                <p className="text-[10px] text-muted-foreground">{lot.address}</p>
                <p className="text-xs font-bold text-primary mt-1">Старт: {(lot.currentPrice || 0).toLocaleString()} ₽</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDelete(lot.id)} className="text-destructive text-[9px] font-bold uppercase"><X className="h-3 w-3 mr-1"/> Отклонить</Button>
                <Button size="sm" onClick={() => handleApprove(lot.id)} className="text-[9px] font-bold uppercase"><Check className="h-3 w-3 mr-1"/> Одобрить</Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="active" className="grid gap-4">
          {activeLots.map(lot => (
            <Card key={lot.id} className="p-4 flex items-center gap-6 border-primary/10">
              <img src={lot.imageUrl} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1">
                <h3 className="text-sm font-bold uppercase">{lot.title}</h3>
                <p className="text-[9px] font-black text-primary">{lot.currentPrice.toLocaleString()} ₽ • {lot.bidsCount} ставок</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleDelete(lot.id)} className="h-8 text-[9px] uppercase font-bold text-destructive"><Trash2 className="h-3 w-3 mr-1"/> Удалить</Button>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="users">
          <Card className="p-0 overflow-hidden border-primary/10">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-[9px] uppercase font-black px-4">Имя / Email</TableHead>
                  <TableHead className="text-[9px] uppercase font-black">Роль</TableHead>
                  <TableHead className="text-right text-[9px] uppercase font-black px-4">Управление</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u: DBUser) => (
                  <TableRow key={u.id}>
                    <TableCell className="px-4">
                      <p className="text-xs font-bold">{u.name}</p>
                      <p className="text-[9px] text-muted-foreground">{u.email}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.role === 'admin' ? 'default' : 'outline'} className="text-[8px] uppercase">
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-4">
                      <div className="flex justify-end gap-2">
                        {/* Кнопка Продавца */}
                        {u.role === 'client' && (
                          <Button size="sm" onClick={() => handleMakeSeller(u.id)} className="h-7 text-[8px] uppercase font-black">
                            В продавцы
                          </Button>
                        )}
                        
                        {/* Кнопка Админа */}
                        {u.role !== 'admin' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleMakeAdmin(u.id)} 
                            className="h-7 text-[8px] uppercase font-black border-primary text-primary"
                          >
                            В админы
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}