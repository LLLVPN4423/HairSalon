import { Link } from 'react-router';
import { ArrowLeft, CalendarDays, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSalonData } from '../context/SalonDataContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Booking() {
  const { getCartCount } = useCart();
  const { data, loading, error } = useSalonData();
  const cartCount = getCartCount();

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
            <CalendarDays className="w-5 h-5 text-amber-500" /> Đặt dịch vụ tại {data.config.salon_name}
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
        <p className="text-neutral-400 mb-8 text-sm">Choose from our expert grooming and styling services.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.services.map((service: any) => (
            <div key={service.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col shadow-lg">
              <Link to={`/item/service/${service.id}`} className="h-48 overflow-hidden relative bg-neutral-950 hover:opacity-80 transition-opacity">
                <img src={service.image} alt={service.name} className="w-full h-full object-cover opacity-70" />
                <div className="absolute top-4 right-4 bg-[#0a0a0a]/80 backdrop-blur-sm px-3 py-1 rounded-full border border-neutral-700">
                  <span className="text-amber-500 font-bold text-sm">${service.price}</span>
                </div>
              </Link>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold mb-6 text-white">{service.name}</h3>
                <Link
                  to={`/item/service/${service.id}`}
                  className="mt-auto w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-colors active:scale-[0.98] text-center"
                >
                  Select Service
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}