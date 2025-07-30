import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(stored);
  }, []);

  useEffect(() => {
    setTotal(cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0));
  }, [cart]);

  function updateQty(index, qty) {
    const updated = [...cart];
    updated[index].qty = qty;
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  }

  function removeItem(index) {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  }

  function goToCheckout() {
    navigate('/checkout');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f5f5' }}>
      <div className="container mx-auto flex-1 max-w-6xl" style={{ margin: '0 auto', width: '100%' }}>
        <div className="header flex justify-between mb-5">
          {/* <div className="greeting text-lg text-gray-800">Your Cart</div> */}

        </div>
        <div className="cart-container bg-white p-5 rounded-lg shadow" style={{ marginBottom: 32 }}>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800">My Cart</h2>
            <div style={{ borderBottom: '1px solid #eee', marginTop: 8, marginBottom: 20 }}></div>
          </div>
          {cart.length === 0 ? (
            <div className="min-h-[40vh] flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <Link to="/products" className="text-blue-600 hover:underline">Browse products</Link>
            </div>
          ) : (
            <>
              {cart.map((item, idx) => (
                <div key={idx} className="cart-item flex flex-wrap md:flex-nowrap justify-between items-center py-4 border-b border-gray-100 last:border-b-0">
                  {/* Product Image */}
                  <div className="flex-shrink-0 mr-4">
                    <img src={item.image || '/placeholder.png'} alt={item.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee', background: '#fafafa' }} />
                  </div>
                  <div className="item-details flex-1 min-w-[180px]">
                    <h3 className="font-semibold text-base text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.variant || ''}</p>
                  </div>
                  <div className="item-price flex-1 text-base text-gray-800">৳{item.price}</div>
                  <div className="item-quantity flex-1 flex items-center">
                    <button onClick={() => updateQty(idx, Math.max(1, (item.qty || 1) - 1))} className="bg-gray-200 px-3 py-1 rounded text-lg">-</button>
                    <input
                      type="number"
                      min="1"
                      value={item.qty || 1}
                      onChange={e => updateQty(idx, Math.max(1, Number(e.target.value)))}
                      className="w-12 border border-gray-300 rounded mx-2 text-center py-1"
                    />
                    <button onClick={() => updateQty(idx, (item.qty || 1) + 1)} className="bg-gray-200 px-3 py-1 rounded text-lg">+</button>
                  </div>
                  <div className="item-remove flex-1 text-right">
                    <button onClick={() => removeItem(idx)} className="bg-red-500 text-white px-4 py-1 rounded">Remove</button>
                  </div>
                </div>
              ))}
              <div className="subtotal flex justify-between items-center py-6 text-lg font-bold text-gray-800">
                <span>Subtotal</span>
                <span>৳{total.toFixed(2)}</span>
              </div>
              <button onClick={goToCheckout} className="checkout-btn w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded text-lg font-semibold transition">Proceed to Checkout</button>
            </>
          )}
        </div>
      </div>
      <Footer />
      <style>{`
        .cart-item { border-bottom: 1px solid #eee; }
        .cart-item:last-child { border-bottom: none; }
        @media (max-width: 768px) {
          .cart-item { flex-direction: column; align-items: flex-start; }
          .item-price, .item-quantity, .item-remove { margin-top: 10px; }
        }
      `}</style>
    </div>
  );
} 