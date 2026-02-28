import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Building2, Home, Briefcase, TrendingUp } from 'lucide-react';
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

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (address) params.set('address', address);
    if (propertyType !== 'all') params.set('type', propertyType);
    if (priceFrom) params.set('priceFrom', priceFrom);
    if (priceTo) params.set('priceTo', priceTo);
    navigate(`/catalog?${params.toString()}`);
  };

  const stats = [
    { label: 'Активных аукционов', value: '156', icon: TrendingUp },
    { label: 'Успешных сделок', value: '2,847', icon: Building2 },
    { label: 'Счастливых семей', value: '5,234', icon: Home },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-background via-card to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto mb-10">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">
              Информационная система для покупки аукционной недвижимости молодыми семьями с детьми
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
              Найдите идеальный дом для вашей семьи на выгодных аукционных условиях
            </p>
          </div>

          <Card className="max-w-5xl mx-auto p-5 shadow-lg border-primary/10 bg-card/50 backdrop-blur">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="lg:col-span-2 text-left">
                <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block ml-1 tracking-tight">Адрес объекта</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  <Input
                    placeholder="Введите город или улицу..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="pl-10 h-10 text-sm"
                  />
                </div>
              </div>

              <div className="text-left">
                <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block ml-1 tracking-tight">Тип жилья</label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все объекты</SelectItem>
                    <SelectItem value="apartment">Квартира</SelectItem>
                    <SelectItem value="house">Дом / Коттедж</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-left">
                <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block ml-1 tracking-tight">Бюджет (₽)</label>
                <div className="flex gap-2">
                  <Input placeholder="От" type="number" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} className="h-10 text-sm" />
                  <Input placeholder="До" type="number" value={priceTo} onChange={(e) => setPriceTo(e.target.value)} className="h-10 text-sm" />
                </div>
              </div>
            </div>

            <Button onClick={handleSearch} className="w-full h-11 text-sm font-bold uppercase tracking-widest" size="lg">
              Найти недвижимость
            </Button>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-12 uppercase tracking-widest">Почему выбирают Encan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 border-primary/5 hover:border-primary/20 transition-all group">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                <Building2 className="h-6 w-6 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Широкий выбор</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Большой каталог жилой недвижимости: просторные квартиры и уютные дома для вашего комфорта.
              </p>
            </Card>

            <Card className="p-6 border-primary/5 hover:border-primary/20 transition-all group">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                <TrendingUp className="h-6 w-6 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Прозрачные торги</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Следите за ставками в реальном времени. Мы обеспечиваем полную открытость процесса.
              </p>
            </Card>

            <Card className="p-6 border-primary/5 hover:border-primary/20 transition-all group">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                <Briefcase className="h-6 w-6 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Безопасные сделки</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Тщательная проверка каждого продавца и многоуровневая верификация для защиты вашей семьи.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}