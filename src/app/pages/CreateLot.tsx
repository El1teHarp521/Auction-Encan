import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Upload, ImageIcon, CheckCircle, Calendar as CalendarIcon, Clock } from 'lucide-react';
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

export function CreateLot() {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("12:00");
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    type: 'apartment',
    area: '',
    rooms: '',
    floor: '',
    startingPrice: '',
  });
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      alert("Пожалуйста, выберите дату завершения аукциона");
      return;
    }
    
    // Формируем финальную дату и время
    const finalEndDate = new Date(date);
    const [hours, minutes] = time.split(':');
    finalEndDate.setHours(parseInt(hours), parseInt(minutes));

    console.log("Аукцион завершится:", finalEndDate);
    alert(`Лот успешно создан! Аукцион завершится: ${format(finalEndDate, 'PPP HH:mm', { locale: ru })}`);
    navigate('/seller');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages([...images, ...fileArray]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" className="mb-6" onClick={() => navigate('/seller')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Назад
      </Button>

      <Card className="p-8 border-primary/10 shadow-lg">
        <h1 className="text-3xl font-bold mb-2 text-primary uppercase tracking-tight">Создать новый лот</h1>
        <p className="text-muted-foreground mb-8">Заполните данные объекта и установите время окончания торгов.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Фотографии */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-3">Фотографии объекта</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border">
                  <img src={img} alt="Upload" className="w-full h-full object-cover" />
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-primary/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors">
                <ImageIcon className="h-8 w-8 text-primary mb-2" />
                <span className="text-[10px] font-bold uppercase">Добавить фото</span>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Название */}
            <div className="grid gap-2">
              <label className="text-sm font-bold uppercase tracking-wider">Заголовок объявления *</label>
              <Input placeholder="Например: Квартира с панорамным видом" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>

            {/* Тип и Цена */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-bold uppercase tracking-wider">Тип недвижимости *</label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Квартира</SelectItem>
                    <SelectItem value="house">Дом</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-bold uppercase tracking-wider">Начальная цена (₽) *</label>
                <Input type="number" placeholder="От 1 000 000" required value={formData.startingPrice} onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })} />
              </div>
            </div>

            {/* ВЫБОР ДАТЫ И ВРЕМЕНИ (НОВОЕ) */}
            <div className="p-5 bg-muted/30 rounded-xl border border-primary/10">
              <label className="text-sm font-bold uppercase tracking-wider mb-4 block">Завершение аукциона *</label>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Календарь */}
                <div className="flex-1 grid gap-2">
                  <span className="text-xs text-muted-foreground">Дата окончания</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal h-11",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                        {date ? format(date, "PPP", { locale: ru }) : <span>Выберите дату</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date()} // Нельзя выбрать прошедшую дату
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Время */}
                <div className="w-full md:w-40 grid gap-2">
                  <span className="text-xs text-muted-foreground">Время (МСК)</span>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                    <Input 
                      type="time" 
                      value={time} 
                      onChange={(e) => setTime(e.target.value)} 
                      className="pl-10 h-11"
                    />
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-3 italic">
                * После наступления этого времени ставки приниматься не будут, и автоматически определится победитель.
              </p>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-bold uppercase tracking-wider">Адрес *</label>
              <Input placeholder="Город, улица, дом" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-bold uppercase tracking-wider text-[10px]">Площадь (м²)</label>
                <Input type="number" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-bold uppercase tracking-wider text-[10px]">Комнат</label>
                <Input type="number" value={formData.rooms} onChange={(e) => setFormData({ ...formData, rooms: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-bold uppercase tracking-wider text-[10px]">Этаж</label>
                <Input type="number" value={formData.floor} onChange={(e) => setFormData({ ...formData, floor: e.target.value })} />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-bold uppercase tracking-wider">Описание объекта</label>
              <Textarea placeholder="Опишите состояние, инфраструктуру и преимущества..." rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
          </div>

          <div className="p-4 bg-primary/5 rounded-xl flex items-start gap-3 border border-primary/10">
            <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ваше объявление пройдет модерацию Артемом (Super Admin) перед публикацией. 
              Ставки начнутся сразу после одобрения.
            </p>
          </div>

          <div className="flex gap-4 pt-2">
            <Button type="submit" className="flex-1 h-12 text-md font-bold uppercase tracking-widest">Разместить лот</Button>
            <Button type="button" variant="outline" className="flex-1 h-12 text-md font-bold uppercase tracking-widest" onClick={() => navigate('/seller')}>Отмена</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}