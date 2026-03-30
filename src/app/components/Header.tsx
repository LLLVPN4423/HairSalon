import { Scissors, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router';
import { useCart } from '../context/CartContext';
import { siteConfig } from '../../config/siteConfig';

export default function Header() {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <header className="sticky top-0 z-50 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Salon Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/30 group-hover:border-amber-500/50 transition-colors">
              {siteConfig.salon_logo ? (
                <img 
                  src={siteConfig.salon_logo} 
                  alt={siteConfig.salon_name || 'Salon'} 
                  className="w-6 h-6 object-contain rounded-full"
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <Scissors className={`w-5 h-5 text-amber-500 ${siteConfig.salon_logo ? 'hidden' : ''}`} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white group-hover:text-amber-500 transition-colors">
                {siteConfig.salon_name || 'Updating...'}
              </h1>
              <p className="text-xs text-neutral-400">
                {siteConfig.tagline || 'Premium Salon'}
              </p>
            </div>
          </Link>

          {/* Cart Icon */}
          {cartCount > 0 && (
            <Link
              to="/cart"
              className="p-2 bg-neutral-800 border border-neutral-700 rounded-full hover:bg-neutral-700 hover:border-amber-500/50 transition-all hover:scale-105"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
