export type UserRole = 'client' | 'seller' | 'admin';

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
  endDate: string;
  createdAt: string;
  bidsCount: number;
}

export interface Bid {
  id: string;
  lotId: string;
  userId: string;
  userName: string;
  amount: number;
  timestamp: string;
}