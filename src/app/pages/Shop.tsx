import { Link } from 'react-router';
import { ArrowLeft, ShoppingBag, Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSalonData } from '../context/SalonDataContext';
import { siteConfig } from '../../config/siteConfig';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Shop() {
  const { data, loading, error } = useSalonData();
  const { cartCount, addProduct } = useCart();

  // Debug: Log data
  console.log('🛍️ Shop page data:', data);
  console.log('🛍️ Shop page products:', data.products);
  console.log('🛍️ Shop page loading:', loading);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading data</p>
          <p className="text-neutral-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-50 pb-20 font-sans selection:bg-amber-500/30">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-neutral-800/60 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <Link to="/" className="p-2 -ml-2 mr-3 text-neutral-400 hover:text-white transition-colors rounded-full hover:bg-neutral-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold flex items-center gap-2 text-white">
            <ShoppingBag className="w-5 h-5 text-white" /> Cửa hàng {siteConfig.salon_name}
          </h1>
        </div>
        <Link
          to="/cart"
          className="relative p-2 text-neutral-400 hover:text-white transition-colors rounded-full hover:bg-neutral-900"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </header>

      {/* Grid */}
      <main className="px-6 py-8 max-w-5xl mx-auto">
        <p className="text-neutral-400 mb-8 text-sm">Elevate your daily routine with our curated hair care products.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.products.map((product: any) => (
            <div key={product.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col shadow-lg">
              <Link to={`/item/product/${product.id}`} className="aspect-square bg-neutral-950 p-4 flex items-center justify-center hover:opacity-80 transition-opacity">
                <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-lighten opacity-90" />
              </Link>
              <div className="p-4 flex flex-col flex-grow border-t border-neutral-800">
                <h3 className="font-medium text-sm mb-1 text-white leading-tight">{product.name}</h3>
                <p className="text-amber-500 font-semibold text-sm mb-4">{product.price.toLocaleString('vi-VN')}đ</p>
                <Link
                  to={`/item/product/${product.id}`}
                  className="mt-auto w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
                >
                  <Plus className="w-4 h-4" /> Add
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}