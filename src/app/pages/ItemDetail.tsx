import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, Plus, Minus, Clock, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSalonData } from '../context/SalonDataContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ItemDetail() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const { addProduct, addService } = useCart();
  const { data, loading, error } = useSalonData();

  // State for products
  const [quantity, setQuantity] = useState(1);

  // State for services
  const [selectedBarberId, setSelectedBarberId] = useState(data.barbers[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const isProduct = type === 'product';
  const item = isProduct
    ? data.products.find((p: any) => p.id === id)
    : data.services.find((s: any) => s.id === id);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <p>Item not found</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (isProduct) {
      addProduct({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity,
      });
    } else {
      if (!selectedDate || !selectedTime) {
        alert('Please select a date and time');
        return;
      }
      const barber = data.barbers.find((b: any) => b.id === selectedBarberId);
      addService({
        id: item.id + '-' + Date.now(), // Unique ID for each booking
        name: item.name,
        price: item.price,
        image: item.image,
        barberId: selectedBarberId,
        barberName: barber?.name || '',
        date: selectedDate,
        time: selectedTime,
      });
    }
    navigate('/cart');
  };

  // Generate time slots
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-50 font-sans selection:bg-amber-500/30">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-neutral-800/60 px-6 py-4">
        <Link
          to={isProduct ? '/shop' : '/booking'}
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>
      </header>

      {/* Desktop: 50/50 Split | Mobile: Stacked */}
      <main className="max-w-7xl mx-auto px-6 py-8 pb-32 md:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left Column: Image */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden aspect-square flex items-center justify-center p-8">
            <img
              src={item.image}
              alt={item.name}
              className="max-w-full max-h-full object-contain mix-blend-lighten opacity-90"
            />
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{item.name}</h1>
              <p className="text-amber-500 text-2xl md:text-3xl font-semibold">${item.price}</p>
              {!isProduct && 'duration' in item && (
                <p className="text-neutral-400 flex items-center gap-2 mt-2">
                  <Clock className="w-4 h-4" />
                  {item.duration}
                </p>
              )}
            </div>

            <p className="text-neutral-300 leading-relaxed">{item.description}</p>

            {/* Product: Quantity Selector */}
            {isProduct && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-neutral-400">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Service: Barber, Date, Time Selection */}
            {!isProduct && (
              <div className="space-y-6">
                {/* Barber Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-neutral-400">Select Barber</label>
                  <div className="grid grid-cols-3 gap-3">
                    {data.barbers.map((barber: any) => (
                      <button
                        key={barber.id}
                        onClick={() => setSelectedBarberId(barber.id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                          selectedBarberId === barber.id
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'
                        }`}
                      >
                        <img
                          src={barber.avatar}
                          alt={barber.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium">{barber.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-neutral-400">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Time Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-neutral-400">Select Time</label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                          selectedTime === time
                            ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                            : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-700'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Sticky Add to Cart Button (Mobile) / Regular Button (Desktop) */}
      <div className="fixed md:relative bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-neutral-800 md:border-0 p-6 md:p-0 md:max-w-7xl md:mx-auto md:px-6 md:-mt-16">
        <button
          onClick={handleAddToCart}
          className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg"
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
