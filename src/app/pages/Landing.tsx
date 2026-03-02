import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, Building2, Home, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card } from '../components/ui/card';

export function Landing() {
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [stats, setStats] = useState({ active: 0 });

  useEffect(() => {
    fetch('http://localhost:8000/lots')
      .then(res => res.json())
      .then(data => setStats({ active: data.filter((l: any) => l.status === 'active').length }))
      .catch(() => setStats({ active: 0 }));
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (address) params.set('address', address);
    if (propertyType !== 'all') params.set('type', propertyType);
    if (priceFrom) params.set('priceFrom', priceFrom);
    if (priceTo) params.set('priceTo', priceTo);
    navigate(`/catalog?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-background via-card to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight tracking-tight">
              Информационная система для покупки аукционной недвижимости молодыми семьями с детьми
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto font-medium">
              В системе сейчас <span className="text-primary font-bold">{stats.active}</span> активных предложений для вашей семьи
            </p>
          </div>

          <Card className="max-w-6xl mx-auto p-6 shadow-2xl border-primary/10 bg-card/60 backdrop-blur-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 mb-4">
              
              {/* Адрес - 5 колонок */}
              <div className="lg:col-span-4 text-left">
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-2 block tracking-widest ml-1">Адрес объекта</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  <Input 
                    placeholder="Город или улица..." 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    className="pl-10 h-11 text-sm border-primary/10 bg-background/50" 
                  />
                </div>
              </div>

              {/* Тип жилья - 3 колонки */}
              <div className="lg:col-span-3 text-left">
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-2 block tracking-widest ml-1">Тип жилья</label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="h-11 text-sm font-medium bg-background/50 border-primary/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все объекты</SelectItem>
                    <SelectItem value="apartment">Квартира</SelectItem>
                    <SelectItem value="house">Дом</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Бюджет - 3 колонки */}
              <div className="lg:col-span-3 text-left">
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-2 block tracking-widest ml-1">Бюджет (₽)</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="От" 
                    type="number" 
                    value={priceFrom} 
                    onChange={(e) => setPriceFrom(e.target.value)} 
                    className="h-11 text-sm border-primary/10 bg-background/50" 
                  />
                  <Input 
                    placeholder="До" 
                    type="number" 
                    value={priceTo} 
                    onChange={(e) => setPriceTo(e.target.value)} 
                    className="h-11 text-sm border-primary/10 bg-background/50" 
                  />
                </div>
              </div>

              {/* Кнопка - 2 колонки */}
              <div className="lg:col-span-2 flex items-end">
                <Button onClick={handleSearch} className="w-full h-11 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20" size="lg">
                  Найти лот
                </Button>
              </div>

            </div>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <div className="space-y-4">
              <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center"><Building2 className="h-6 w-6 text-primary" /></div>
              <h3 className="text-lg font-bold uppercase tracking-tight">Подбор жилья</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Только проверенные жилые объекты: просторные квартиры и уютные дома, отобранные специально для комфортного проживания с детьми.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center"><TrendingUp className="h-6 w-6 text-primary" /></div>
              <h3 className="text-lg font-bold uppercase tracking-tight">Прозрачность</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Все ставки мгновенно фиксируются в базе данных системы Encan. Вы можете отслеживать историю предложений в режиме реального времени.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center"><Home className="h-6 w-6 text-primary" /></div>
              <h3 className="text-lg font-bold uppercase tracking-tight">Для молодых семей</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Мы адаптировали интерфейс и инструменты поиска для того, чтобы покупка жилья на аукционе стала доступной и безопасной для родителей.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}