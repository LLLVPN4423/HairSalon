import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Scissors, CalendarDays, ShoppingBag, ArrowRight, ShoppingCart, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useSalonData } from '../context/SalonDataContext';
import { siteConfig } from '../../config/siteConfig';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const { getCartCount } = useCart();
  const { data, loading, error, refetch, lastRefresh } = useSalonData();
  const cartCount = getCartCount();
  const featuredServices = data.services.slice(0, 3);
  const featuredProducts = data.products.slice(0, 3);
  const [isForceRefreshing, setIsForceRefreshing] = useState(false);

  const handleForceRefresh = async () => {
    setIsForceRefreshing(true);
    await refetch();
    setTimeout(() => setIsForceRefreshing(false), 2000); // Show loading for 2 seconds
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading salon data</p>
          <p className="text-neutral-400">{error}</p>
          <button 
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-50 pb-20 font-sans selection:bg-amber-500/30">
      <Header />
      
      {/* Cart Icon - Fixed positioning */}
      {cartCount > 0 && (
        <Link
          to="/cart"
          className="fixed top-20 right-6 z-50 p-3 bg-neutral-900 border border-neutral-800 rounded-full hover:bg-neutral-800 transition-colors shadow-lg"
        >
          <ShoppingCart className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        </Link>
      )}

      {/* Hero Section */}
      <section className="relative h-[55vh] w-full flex flex-col items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 z-0">
          <img 
            src={siteConfig.hero_image_url || 'https://images.unsplash.com/photo-1769034260387-39fa07f0c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'} 
            alt="Salon Interior" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/30 via-[#0a0a0a]/60 to-[#0a0a0a]" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center mt-8">
          <div className="mb-6 p-4 rounded-full bg-neutral-900/50 backdrop-blur-md border border-amber-500/30">
            {siteConfig.salon_logo ? (
              <img 
                src={siteConfig.salon_logo} 
                alt={siteConfig.salon_name || 'Salon'} 
                className="w-8 h-8 object-contain rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <Scissors className={`w-8 h-8 text-amber-500 ${siteConfig.salon_logo ? 'hidden' : ''}`} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {siteConfig.salon_name.split(' ').map((word: string, index: number) => 
              index === 1 ? <span key={index} className="text-amber-500 italic font-serif pr-2">{word}</span> : word
            )}
          </h1>
          <p className="text-neutral-400 max-w-sm text-sm md:text-base leading-relaxed">
            {siteConfig.hero_subtitle}
          </p>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="px-6 -mt-12 relative z-20 max-w-lg mx-auto w-full space-y-4">
        {/* Refresh Button */}
        <div className="flex items-center justify-between bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-4">
          <div className="text-neutral-300 text-sm">
            {lastRefresh ? (
              <span>Cập nhật lần cuối: {lastRefresh.toLocaleTimeString('vi-VN')}</span>
            ) : (
              <span>Đang tải dữ liệu...</span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black text-sm font-medium rounded-lg transition-colors active:scale-[0.98]"
            >
              <RefreshCw className="w-4 h-4" />
              Cập nhật
            </button>
            <button
              onClick={handleForceRefresh}
              disabled={isForceRefreshing}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:bg-red-700 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors active:scale-[0.98]"
            >
              <RefreshCw className={`w-4 h-4 ${isForceRefreshing ? 'animate-spin' : ''}`} />
              {isForceRefreshing ? 'Đang cập nhật...' : 'Force'}
            </button>
          </div>
        </div>
        
        <Link to="/booking" className="block">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="flex items-center p-5 bg-neutral-900 border border-neutral-800 rounded-2xl hover:border-amber-500/50 transition-colors shadow-2xl"
          >
            <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mr-4 shrink-0">
              <CalendarDays className="w-6 h-6 text-amber-500" />
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-white">Book a Service</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Schedule your next appointment</p>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-500" />
          </motion.div>
        </Link>

        <Link to="/shop" className="block">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="flex items-center p-5 bg-neutral-900 border border-neutral-800 rounded-2xl hover:border-white/50 transition-colors shadow-2xl"
          >
            <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mr-4 shrink-0">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-white">Buy Products</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Shop premium hair care</p>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-500" />
          </motion.div>
        </Link>
      </section>

      {/* Featured Services */}
      <section className="px-6 mt-16 max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-xl font-bold tracking-tight text-white">Featured Services</h2>
          <Link to="/booking" className="text-sm text-amber-500 font-medium hover:text-amber-400 transition-colors">View All</Link>
        </div>
        <div className="flex overflow-x-auto pb-6 -mx-6 px-6 gap-4 snap-x scrollbar-hide">
          {featuredServices.map(service => (
            <Link key={service.id} to={`/item/service/${service.id}`} className="snap-start shrink-0 w-64 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg hover:border-neutral-700 transition-colors">
              <div className="h-40 overflow-hidden relative bg-neutral-950">
                <img src={service.image} alt={service.name} className="w-full h-full object-cover opacity-70" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-base text-white">{service.name}</h3>
                <p className="text-amber-500 font-medium mt-1">{service.price.toLocaleString('vi-VN')}đ</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-6 mt-6 max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-xl font-bold tracking-tight text-white">Featured Products</h2>
          <Link to="/shop" className="text-sm text-amber-500 font-medium hover:text-amber-400 transition-colors">View All</Link>
        </div>
        <div className="flex overflow-x-auto pb-6 -mx-6 px-6 gap-4 snap-x scrollbar-hide">
          {featuredProducts.map(product => (
            <Link key={product.id} to={`/item/product/${product.id}`} className="snap-start shrink-0 w-44 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col shadow-lg hover:border-neutral-700 transition-colors">
              <div className="h-44 bg-neutral-950 p-4 flex items-center justify-center">
                <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-lighten opacity-90" />
              </div>
              <div className="flex-grow flex flex-col justify-between bg-neutral-900 border-t border-neutral-800 p-3">
                <h3 className="font-medium text-xs text-white mb-2 leading-tight line-clamp-2 overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {product.name}
                </h3>
                <p className="text-amber-500 font-semibold text-sm">{product.price.toLocaleString('vi-VN')}đ</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}