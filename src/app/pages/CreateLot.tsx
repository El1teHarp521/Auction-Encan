import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Upload, ImageIcon, CheckCircle, Calendar as CalendarIcon, Clock, X } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '../components/ui/utils';
import { useAuth } from '../contexts/AuthContext';

export function CreateLot() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("12:00");
  const [images, setImages] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    type: 'apartment' as 'apartment' | 'house',
    area: '',
    rooms: '',
    floor: '',
    startingPrice: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => setImages(prev => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return alert("Вы не вошли в систему");
    if (!date) return alert("Выберите дату");

    const finalEndDate = new Date(date);
    const [hours, minutes] = time.split(':');
    finalEndDate.setHours(parseInt(hours), parseInt(minutes));

    const newLot = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      area: Number(formData.area),
      startingPrice: Number(formData.startingPrice),
      currentPrice: Number(formData.startingPrice),
      imageUrl: images[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
      sellerId: user.id,
      sellerName: user.name,
      status: "pending",
      endDate: finalEndDate.toISOString(),
      createdAt: new Date().toISOString(),
      bidsCount: 0
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/lots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLot),
      });

      if (response.ok) {
        alert('Заявка отправлена! Проверьте вкладку "Очередь" в админ-панели.');
        navigate('/seller');
      } else {
        const errorText = await response.text();
        console.error("Ошибка сервера:", errorText);
        alert(`Ошибка сервера: ${response.status}. Возможно, фото слишком тяжелое.`);
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      alert('Нет связи с бэкэндом. Проверьте терминал с командой npm run backend');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" className="mb-6 h-7 text-[10px] uppercase font-bold text-muted-foreground" onClick={() => navigate('/seller')}>
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Назад
      </Button>

      <Card className="p-8 border-primary/10 shadow-lg bg-card/50">
        <h1 className="text-xl font-black mb-1 text-primary uppercase tracking-tighter">Новый лот Encan</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[10px] font-black uppercase text-muted-foreground mb-3">Фото объекта</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary/20">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setImages(prev => prev.filter((_, i) => i !== index))} className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1"><X className="h-3 w-3" /></button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-primary/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-all">
                <ImageIcon className="h-6 w-6 text-primary" />
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="grid gap-4">
            <Input placeholder="Заголовок" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="h-11 font-bold" />
            
            <div className="grid grid-cols-2 gap-4">
              <Select value={formData.type} onValueChange={(v:any) => setFormData({...formData, type: v})}>
                <SelectTrigger className="h-11 font-bold"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="apartment">Квартира</SelectItem><SelectItem value="house">Дом</SelectItem></SelectContent>
              </Select>
              <Input type="number" placeholder="Цена старта (₽)" required value={formData.startingPrice} onChange={e => setFormData({...formData, startingPrice: e.target.value})} className="h-11 font-bold" />
            </div>

            <div className="p-4 bg-muted/30 rounded-xl border border-primary/10 flex flex-col md:flex-row gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 justify-start h-11 font-bold">{date ? format(date, "PPP", { locale: ru }) : "Дата окончания"}</Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} disabled={d => d < new Date()} /></PopoverContent>
              </Popover>
              <Input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full md:w-32 h-11 font-bold" />
            </div>

            <Input placeholder="Адрес" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="h-11 font-bold" />
            
            <div className="grid grid-cols-3 gap-4">
              <Input type="number" placeholder="Площадь" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="h-11 font-bold" />
              <Input type="number" placeholder="Комнат" value={formData.rooms} onChange={e => setFormData({...formData, rooms: e.target.value})} className="h-11 font-bold" />
              <Input type="number" placeholder="Этаж" value={formData.floor} onChange={e => setFormData({...formData, floor: e.target.value})} className="h-11 font-bold" />
            </div>

            <Textarea placeholder="Описание..." rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="font-medium" />
          </div>

          <Button type="submit" className="w-full h-12 font-black uppercase tracking-widest">Отправить на модерацию</Button>
        </form>
      </Card>
    </div>
  );
}