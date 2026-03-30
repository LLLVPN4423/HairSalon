import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, Scissors, Loader2, Gift } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSalonData } from '../context/SalonDataContext';
import emailjs from '@emailjs/browser';

export default function Cart() {
  const { items, removeItem, updateProductQuantity, clearCart } = useCart();
  const { data } = useSalonData();
  const navigate = useNavigate();

  const [tipAmount, setTipAmount] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  
  // Loyalty Program States
  const [availablePoints, setAvailablePoints] = useState(0);
  const [isCheckingPoints, setIsCheckingPoints] = useState(false);
  const [applyPoints, setApplyPoints] = useState(false);
  const [pointsChecked, setPointsChecked] = useState(false);

  const services = items.filter(item => item.type === 'service');
  const products = items.filter(item => item.type === 'product');

  const subtotal = items.reduce((sum, item) => {
    if (item.type === 'product') {
      return sum + item.price * item.quantity;
    }
    return sum + item.price;
  }, 0);

  const originalTotal = subtotal + tipAmount;
  const pointsDiscount = applyPoints ? Math.min(availablePoints, originalTotal) : 0;
  const finalTotal = Math.max(0, originalTotal - pointsDiscount);

  const handleCheckPoints = async () => {
    if (!customerPhone) {
      alert('Vui lòng nhập số điện thoại để kiểm tra điểm');
      return;
    }

    setIsCheckingPoints(true);
    
    // Mock API call - simulate 1.5s delay
    setTimeout(() => {
      setAvailablePoints(50000);
      setPointsChecked(true);
      setIsCheckingPoints(false);
      alert('Bạn có 50.000 điểm!');
    }, 1500);
  };

  const handleCheckout = async () => {
    if (!customerName || !customerPhone) {
      alert('Please fill in your contact information');
      return;
    }
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsLoading(true);

    try {
      // Format order details for EmailJS
      const orderDetails = items.map(item => {
        if (item.type === 'service') {
          return `${item.name} - With ${item.barberName} (${item.date} at ${item.time}) - $${item.price}`;
        } else {
          return `${item.name} (x${item.quantity}) - $${item.price * item.quantity}`;
        }
      }).join('\n');

      // Send order notification via EmailJS
      const templateParams = {
        customer_name: customerName,
        phone: customerPhone,
        order_details: orderDetails,
        total_price: `$${finalTotal.toFixed(2)}`,
        discount_info: applyPoints ? `Points used: ${pointsDiscount} (${availablePoints} available)` : 'No points used'
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      // TODO: API call to update points after successful order
      // await fetch('/api/loyalty/update', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     phone: customerPhone,
      //     pointsUsed: pointsDiscount,
      //     action: 'deduct'
      //   })
      // });

      // Generate VietQR URL on success
      const bankId = import.meta.env.VITE_BANK_ID;
      const accountNo = import.meta.env.VITE_ACCOUNT_NUMBER;
      const accountName = import.meta.env.VITE_ACCOUNT_NAME;
      const addInfo = `${customerName.replace(/ /g, '%20')}%20thanh%20toan`;
      
      const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${finalTotal}&addInfo=${addInfo}&accountName=${accountName}`;
      
      setQrCodeUrl(qrUrl);
      setShowPayment(true);

    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to process order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-50 font-sans selection:bg-amber-500/30 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-neutral-800/60 px-6 py-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại trang chủ</span>
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Cart & Checkout</h1>

        {items.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center">
            <p className="text-neutral-400 mb-4">Giỏ hàng của bạn đang trống</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors"
            >
              Quay lại trang chủ
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Your Services */}
            {services.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-amber-500" />
                  Your Services
                </h2>
                <div className="space-y-3">
                  {services.map(service => {
                    if (service.type !== 'service') return null;
                    return (
                      <div
                        key={service.id}
                        className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex gap-4"
                      >
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-20 h-20 rounded-lg object-cover mix-blend-lighten opacity-90"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{service.name}</h3>
                          <p className="text-sm text-neutral-400 mb-2">
                            With {service.barberName} • {service.date} at {service.time}
                          </p>
                          <p className="text-amber-500 font-semibold">${service.price}</p>
                        </div>
                        <button
                          onClick={() => removeItem(service.id)}
                          className="text-neutral-400 hover:text-red-500 transition-colors p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Your Products */}
            {products.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-500" />
                  Your Products
                </h2>
                <div className="space-y-3">
                  {products.map(product => {
                    if (product.type !== 'product') return null;
                    return (
                      <div
                        key={product.id}
                        className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex gap-4"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 rounded-lg object-cover mix-blend-lighten opacity-90"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{product.name}</h3>
                          <p className="text-amber-500 font-semibold mb-3">${product.price}</p>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                updateProductQuantity(product.id, product.quantity - 1)
                              }
                              className="w-8 h-8 bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-semibold w-8 text-center">
                              {product.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateProductQuantity(product.id, product.quantity + 1)
                              }
                              className="w-8 h-8 bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="text-neutral-400 hover:text-red-500 transition-colors p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tip Amount */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <label className="block text-sm font-medium text-neutral-400 mb-3">
                Add a Tip (Optional)
              </label>
              <div className="flex gap-3 mb-4">
                {[5, 10, 15, 20].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setTipAmount(amount)}
                    className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                      tipAmount === amount
                        ? 'bg-amber-500 text-black'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Custom amount"
                value={tipAmount || ''}
                onChange={(e) => setTipAmount(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Loyalty Points */}
            {availablePoints > 0 && (
              <div className="bg-gradient-to-r from-amber-900/20 to-yellow-900/20 border border-amber-500/30 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Gift className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-bold text-amber-500">Ưu đãi khách hàng thân thiết</h3>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-neutral-300">
                    <span>Điểm khả dụng</span>
                    <span className="text-amber-500 font-medium">{availablePoints.toLocaleString('vi-VN')} điểm</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>Giá trị quy đổi</span>
                    <span className="text-amber-500 font-medium">${Math.min(availablePoints, originalTotal).toFixed(2)}</span>
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={applyPoints}
                    onChange={(e) => setApplyPoints(e.target.checked)}
                    className="w-5 h-5 text-amber-500 bg-neutral-800 border-neutral-600 rounded focus:ring-amber-500 focus:ring-2"
                  />
                  <span className="text-amber-500 font-medium">
                    Sử dụng {availablePoints.toLocaleString('vi-VN')} điểm để giảm giá
                  </span>
                </label>
              </div>
            )}

            {/* Customer Info */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Phone Number
                  </label>
                  <div className="space-y-3">
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                    <button
                      onClick={handleCheckPoints}
                      disabled={isCheckingPoints || !customerPhone}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-neutral-700 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {isCheckingPoints ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Kiểm tra...
                        </>
                      ) : (
                        <>
                          <Gift className="w-4 h-4" />
                          Kiểm tra điểm
                        </>
                      )}
                    </button>
                    {pointsChecked && (
                      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        <p className="text-amber-500 font-medium text-sm">
                          🎉 Bạn có {availablePoints.toLocaleString('vi-VN')} điểm!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Total Summary */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-neutral-300">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between text-neutral-300">
                    <span>Tip</span>
                    <span>${tipAmount.toFixed(2)}</span>
                  </div>
                )}
                {pointsDiscount > 0 && (
                  <div className="flex justify-between text-amber-500">
                    <span>Điểm sử dụng</span>
                    <span>-${pointsDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-neutral-800 pt-3 flex justify-between text-xl font-bold">
                  <span>Thành tiền</span>
                  <span className="text-amber-500">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Sticky Checkout Button */}
      {items.length > 0 && !showPayment && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-neutral-800 p-6">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-neutral-700 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Booking & Checkout'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Payment QR Code Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-amber-500">Payment Required</h2>
            <p className="text-neutral-300 mb-6">
              Order confirmed! Please scan the QR code below to complete your payment of <span className="text-amber-500 font-bold">${finalTotal.toFixed(2)}</span>
            </p>
            
            {qrCodeUrl && (
              <div className="bg-white p-4 rounded-xl mb-6 inline-block">
                <img 
                  src={qrCodeUrl} 
                  alt="VietQR Payment Code" 
                  className="w-64 h-64 object-contain"
                />
              </div>
            )}
            
            <p className="text-sm text-neutral-400 mb-6">
              Open your banking app and scan this QR code to complete the payment
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowPayment(false);
                  clearCart();
                  navigate('/');
                }}
                className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg transition-colors"
              >
                Done
              </button>
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
