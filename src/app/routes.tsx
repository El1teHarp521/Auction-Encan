import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Verification } from './pages/Verification';
import { Catalog } from './pages/Catalog';
import { LotDetails } from './pages/LotDetails';
import { ClientDashboard } from './pages/ClientDashboard';
import { SellerDashboard } from './pages/SellerDashboard';
import { CreateLot } from './pages/CreateLot';
import { AdminPanel } from './pages/AdminPanel';
import { AuctionWinner } from './pages/AuctionWinner';
import { LotBids } from './pages/LotBids';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Landing },
      { path: 'login', Component: Login },
      { path: 'signup', Component: SignUp },
      { path: 'verification', Component: Verification },
      { path: 'catalog', Component: Catalog },
      { path: 'lot/:id', Component: LotDetails },
      { path: 'dashboard', Component: ClientDashboard },
      { path: 'seller', Component: SellerDashboard },
      { path: 'seller/create', Component: CreateLot },
      { path: 'seller/lot/:id/bids', Component: LotBids },
      { path: 'admin', Component: AdminPanel },
      { path: 'winner/:id', Component: AuctionWinner },
    ],
  },
]);