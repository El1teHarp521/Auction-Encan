export type UserRole = 'guest' | 'client' | 'seller' | 'admin';

export interface Lot {
  id: string;
  title: string;
  description: string;
  address: string;
  type: 'apartment' | 'house';
  area: number;
  rooms?: number;
  floor?: number;
  currentPrice: number;
  startingPrice: number;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  status: 'pending' | 'active' | 'closed' | 'rejected';
  endDate: Date;
  createdAt: Date;
  bidsCount: number;
}

export interface Bid {
  id: string;
  lotId: string;
  userId: string;
  userName: string;
  amount: number;
  timestamp: Date;
}

export const mockLots: Lot[] = [
  {
    id: '1',
    title: '3-комнатная квартира в центре',
    description: 'Просторная квартира с современным ремонтом и панорамными окнами',
    address: 'ул. Тверская, 15',
    type: 'apartment',
    area: 85,
    rooms: 3,
    floor: 12,
    currentPrice: 15500000,
    startingPrice: 14000000,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    sellerId: '1',
    sellerName: 'Иван Петров',
    status: 'active',
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    bidsCount: 12,
  },
  {
    id: '2',
    title: 'Загородный дом с участком',
    description: 'Двухэтажный дом в коттеджном поселке, участок 15 соток',
    address: 'пос. Зеленый Бор, ул. Садовая, 42',
    type: 'house',
    area: 220,
    rooms: 5,
    currentPrice: 28000000,
    startingPrice: 25000000,
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    sellerId: '2',
    sellerName: 'Мария Соколова',
    status: 'active',
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    bidsCount: 8,
  },
  {
    id: '4',
    title: '2-комнатная квартира с видом на парк',
    description: 'Светлая квартира с балконом и видом на городской парк',
    address: 'ул. Парковая, 23',
    type: 'apartment',
    area: 62,
    rooms: 2,
    floor: 8,
    currentPrice: 9800000,
    startingPrice: 9000000,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    sellerId: '1',
    sellerName: 'Иван Петров',
    status: 'active',
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    bidsCount: 15,
  },
  {
    id: '5',
    title: 'Студия в новостройке',
    description: 'Компактная студия с чистовой отделкой',
    address: 'ул. Новая, 77',
    type: 'apartment',
    area: 28,
    rooms: 1,
    floor: 3,
    currentPrice: 5200000,
    startingPrice: 5000000,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    sellerId: '2',
    sellerName: 'Мария Соколова',
    status: 'pending',
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    bidsCount: 0,
  }
];

export const mockBids: Bid[] = [
  { id: '1', lotId: '1', userId: '2', userName: 'Алексей К.', amount: 15500000, timestamp: new Date() }
];