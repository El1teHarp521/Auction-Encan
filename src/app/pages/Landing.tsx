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
    { label: 'Довольных клиентов', value: '5,234', icon: Home },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-background via-card to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Платформа аукционов недвижимости
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Найдите идеальную недвижимость или продайте свою на выгодных условиях
            </p>
          </div>

          {/* Search Block */}
          <Card className="max-w-5xl mx-auto p-6 shadow-xl border-primary/20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="lg:col-span-2">
                <label className="text-sm mb-2 block text-muted-foreground">Адрес</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Введите адрес..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="pl-10"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm mb-2 block text-muted-foreground">Тип недвижимости</label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы</SelectItem>
                    <SelectItem value="apartment">Квартира</SelectItem>
                    <SelectItem value="house">Дом</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm mb-2 block text-muted-foreground">Цена</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="От"
                    type="number"
                    value={priceFrom}
                    onChange={(e) => setPriceFrom(e.target.value)}
                    className="w-full"
                  />
                  <Input
                    placeholder="До"
                    type="number"
                    value={priceTo}
                    onChange={(e) => setPriceTo(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleSearch} className="w-full" size="lg">
              <Search className="mr-2 h-5 w-5" />
              Найти недвижимость
            </Button>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-6 text-center hover:border-primary/50 transition-colors">
                <stat.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Почему выбирают Encan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6">
              <Building2 className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Широкий выбор</h3>
              <p className="text-muted-foreground">
                Квартиры, дома, коммерческая недвижимость — все в одном месте
              </p>
            </Card>

            <Card className="p-6">
              <TrendingUp className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Прозрачные торги</h3>
              <p className="text-muted-foreground">
                Следите за ставками в реальном времени и делайте осознанный выбор
              </p>
            </Card>

            <Card className="p-6">
              <Briefcase className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Безопасные сделки</h3>
              <p className="text-muted-foreground">
                Проверенные продавцы и надежная система верификации
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
