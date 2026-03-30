import { RouterProvider } from 'react-router';
import { router } from './routes';
import { CartProvider } from './context/CartContext';
import { SalonDataProvider } from './context/SalonDataContext';
import { siteConfig } from '../config/siteConfig';

export default function App() {
  return (
    <SalonDataProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </SalonDataProvider>
  );
}