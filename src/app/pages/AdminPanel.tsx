import { useState } from 'react';
import { Shield, Users, Package, Check, X, ShieldAlert } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { mockLots } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function AdminPanel() {
  const { user, promoteToAdmin } = useAuth();
  const pendingLots = mockLots.filter((lot) => lot.status === 'pending');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-10">
        <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Управление Encan</h1>
          <p className="text-muted-foreground">Администратор: {user?.name}</p>
        </div>
      </div>

      <Tabs defaultValue="moderation" className="space-y-8">
        <TabsList className="bg-muted p-1 rounded-xl">
          <TabsTrigger value="moderation">Лоты на проверке ({pendingLots.length})</TabsTrigger>
          <TabsTrigger value="users">Управление пользователями</TabsTrigger>
        </TabsList>

        <TabsContent value="moderation" className="grid gap-6">
          {pendingLots.map((lot) => (
            <Card key={lot.id} className="p-6 flex flex-col md:flex-row gap-6 items-center">
              <img src={lot.imageUrl} alt="" className="w-32 h-32 rounded-xl object-cover" />
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold">{lot.title}</h3>
                <p className="text-sm text-muted-foreground">{lot.address}</p>
                <Badge className="mt-2" variant="secondary">{lot.type === 'apartment' ? 'Квартира' : 'Дом'}</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="text-destructive border-destructive/20"><X className="h-4 w-4 mr-1"/> Отклонить</Button>
                <Button className="bg-primary"><Check className="h-4 w-4 mr-1"/> Одобрить</Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="users">
          <Card className="p-0 overflow-hidden border-primary/10">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Имя</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Роль</TableHead>
                  <TableHead className="text-right">Управление</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Алексей Смирнов</TableCell>
                  <TableCell>alex@mail.ru</TableCell>
                  <TableCell><Badge variant="outline">Клиент</Badge></TableCell>
                  <TableCell className="text-right">
                    {user?.isSuperAdmin ? (
                      <Button size="sm" variant="outline" onClick={() => promoteToAdmin('alex-id')} className="text-primary border-primary/20 hover:bg-primary/5">
                        <ShieldAlert className="mr-2 h-4 w-4" /> Назначить Админом
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Доступно только Супер-Админу</span>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}