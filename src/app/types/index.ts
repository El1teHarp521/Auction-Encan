export interface Lot {
  id: number;
  title: string;
  description: string;
  address: string;
  type: 'apartment' | 'house';
  imageUrl: string;
  currentPrice: number;
  area: number;
  sellerName: string;
  endDate: string;
  bidsCount: number;
}

export interface Bid {
  id: number;
  lot_id: number;
  amount: number;
  user_name: string;
  user_id: number;
  created_at: string;
}
export interface Lot {
  id: number; // Теперь это число
  title: string;
  description: string;
  address: string;
  type: 'apartment' | 'house';
  status: 'pending' | 'active' | 'closed';
  imageUrl: string;
  currentPrice: number;
  startingPrice: number; // Добавили
  area: number;
  sellerId: number;      // Добавили
  sellerName: string;
  endDate: string;
  bidsCount: number;
}