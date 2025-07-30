import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { MdDelete } from 'react-icons/md';

const DELIVERY_OPTIONS = [
  { label: 'ঢাকার ভিতরে (130 TK)', value: 130 },
  { label: 'ঢাকার বাইরে (110 TK)', value: 110 }
];

export default function Checkout() {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [delivery, setDelivery] = useState(DELIVERY_OPTIONS[0].value);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [incompleteOrderId, setIncompleteOrderId] = useState(null);
  const [isIncompleteOrder, setIsIncompleteOrder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Quantity update
  function updateQty(idx, qty) {
    const updated = [...cart];
    updated[idx].qty = Math.max(1, qty);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  }
  // Remove item
  function removeItem(idx) {
    const updated = cart.filter((_, i) => i !== idx);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  }

  function handleChange(e) {
    const newForm = { ...form, [e.target.name]: e.target.value };
    setForm(newForm);
    
    console.log('Form changed:', { field: e.target.name, value: e.target.value, cartLength: cart.length });
    
    // If phone number is entered and cart has items, create incomplete order
    if (e.target.name === 'phone' && newForm.phone && newForm.phone.length >= 11 && cart.length > 0) {
      console.log('📱 Phone number entered, creating incomplete order...');
      createIncompleteOrder(newForm);
    }
  }

  const createIncompleteOrder = async (formData) => {
    if (incompleteOrderId) return; // Already created
    
    try {
      console.log('Creating incomplete order...', { formData, cart });
      
      const items = cart.map(item => ({
        product_id: item.id,
        quantity: item.qty || 1,
        price: item.price
      }));
      const subtotal = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
      const total = subtotal + Number(delivery);
      
      const orderData = { 
        ...formData, 
        items, 
        total, 
        shipping: delivery, 
        status: 'incomplete',
        payment_status: 'pending'
      };
      
      console.log('Sending order data:', orderData);
      
      // Get token from localStorage if available (for admin users)
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: 'Bearer ' + token } : {})
      };
      
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData)
      });
      
      console.log('Response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        setIncompleteOrderId(data.id);
        setIsIncompleteOrder(true);
        console.log('✅ Incomplete order created successfully:', data.id);
      } else {
        const errorText = await res.text();
        console.error('❌ Failed to create incomplete order:', res.status, errorText);
      }
    } catch (err) {
      console.error('❌ Error creating incomplete order:', err);
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    
    // Check if at least phone number is provided (minimum requirement)
    if (!form.phone || form.phone.trim() === '') {
      setError('মোবাইল নম্বর অবশ্যই দিতে হবে।');
      return;
    }
    
    // Check if cart has items (products)
    if (cart.length === 0) {
      setError('কমপক্ষে একটি প্রোডাক্ট নির্বাচন করুন।');
      return;
    }
    
    if (!agree) {
      setError('You must agree with the Terms and Conditions.');
      return;
    }
    
    setLoading(true);
    setError(null); // Clear previous errors
    
    // If we have an incomplete order, update it to complete
    if (incompleteOrderId) {
      completeIncompleteOrder();
    } else {
      // Create new complete order
      createCompleteOrder();
    }
  }

  const completeIncompleteOrder = async () => {
    try {
      // Get token from localStorage if available (for admin users)
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: 'Bearer ' + token } : {})
      };
      
      const res = await fetch(`/api/orders/${incompleteOrderId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          name: form.name,
          address: form.address,
          status: 'pending',
          payment_status: 'pending'
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to complete order');
      }
      
      const data = await res.json();
      localStorage.removeItem('cart');
      setCart([]);
      navigate(`/order-confirmation/${data.id}`, { state: { order: data } });
    } catch (err) {
      setError(err.message || 'Order completion failed. Please try again.');
      setLoading(false);
    }
  };

  const createCompleteOrder = async () => {
    try {
      const items = cart.map(item => ({
        product_id: item.id,
        quantity: item.qty,
        price: item.price
      }));
      const subtotal = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
      const total = subtotal + Number(delivery);
      
      const orderData = { 
        ...form, 
        items, 
        total, 
        shipping: delivery, 
        status: 'pending',
        payment_status: 'pending'
      };
      
      // Get token from localStorage if available (for admin users)
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: 'Bearer ' + token } : {})
      };
      
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Order failed: ${res.status}`);
      }
      
      const data = await res.json();
      localStorage.removeItem('cart');
      setCart([]);
      navigate(`/order-confirmation/${data.id}`, { state: { order: data } });
    } catch (err) {
      setError(err.message || 'Order failed. Please try again.');
      setLoading(false);
    }
  };

  if (cart.length === 0) return <div className="p-6">Your cart is empty.</div>;

  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
  const total = subtotal + Number(delivery);

  return (
    <div className="max-w-5xl mx-auto p-4 grid md:grid-cols-2 gap-6 bg-gray-50 rounded-lg shadow my-8">
      {/* Left: Customer Info */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
        <div className="text-red-600 font-bold text-center mb-2">
          * শুধুমাত্র মোবাইল নম্বর দিয়েও অর্ডার করতে পারবেন <br />
          <span className="text-base text-pink-600">অর্ডার কনফার্ম করুন</span> বাটনে ক্লিক করুন!
        </div>
        {isIncompleteOrder && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg text-sm">
            ✅ অসম্পূর্ণ অর্ডার তৈরি হয়েছে! এখন নাম/ঠিকানা যোগ করে সম্পূর্ণ করুন।
          </div>
        )}
        <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded w-full" placeholder="আপনার সম্পূর্ণ নাম লিখুন (ঐচ্ছিক)" />
        <input name="phone" value={form.phone} onChange={handleChange} required className="border p-2 rounded w-full" placeholder="১১ ডিজিটের মোবাইল নম্বর লিখুন *" />
        <textarea name="address" value={form.address} onChange={handleChange} className="border p-2 rounded w-full" placeholder="আপনার সম্পূর্ণ ঠিকানা যেমন: গ্রাম, থানা, জেলা লিখুন (ঐচ্ছিক)" />
        <div>
          {DELIVERY_OPTIONS.map(opt => (
            <label key={opt.value} className="block mb-1">
              <input
                type="radio"
                name="delivery"
                value={opt.value}
                checked={delivery === opt.value}
                onChange={() => setDelivery(opt.value)}
                className="mr-2"
              />
              {opt.label}
            </label>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
          I agree with the <a href="/terms" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>
        </label>
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 rounded transition"
          disabled={loading}
        >
          {loading ? 'অর্ডার হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}
        </button>
      </form>

      {/* Right: Order Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-center">আপনার অর্ডার</h2>
        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Product</th>
              <th className="py-2">Price</th>
              <th className="py-2">Quantity</th>
              <th className="py-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, idx) => (
              <tr key={item.id} className="border-b">
                <td className="py-2 flex items-center gap-2">
                  <img src={item.image || '/placeholder.png'} alt={item.name} className="w-10 h-10 object-cover rounded" />
                  <span>{item.name}</span>
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="text-red-600 hover:text-red-800 text-2xl focus:outline-none"
                    title="Remove"
                  >
                    <MdDelete />
                  </button>
                </td>
                <td className="py-2 text-center">৳{Number(item.price).toFixed(2)}</td>
                <td className="py-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button type="button" onClick={() => updateQty(idx, (item.qty || 1) - 1)} className="px-2 py-1 bg-gray-200 rounded text-lg" disabled={item.qty <= 1}>-</button>
                    <span className="px-2">{item.qty || 1}</span>
                    <button type="button" onClick={() => updateQty(idx, (item.qty || 1) + 1)} className="px-2 py-1 bg-gray-200 rounded text-lg">+</button>
                  </div>
                </td>
                <td className="py-2 text-center font-bold">৳{(Number(item.price) * (item.qty || 1)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between font-semibold mb-1">
          <span>Subtotal</span>
          <span>৳{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Shipping</span>
          <span>৳{Number(delivery).toFixed(0)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-green-600">
          <span>Total</span>
          <span>৳{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
} 