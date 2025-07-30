import { useLocation, Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';

export default function OrderConfirmation() {
  const { state } = useLocation();
  const { id } = useParams();
  const [order, setOrder] = useState(state?.order || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!order && id) {
      setLoading(true);
      fetch(`/api/orders/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Order not found');
          return res.json();
        })
        .then(data => {
          setOrder(data);
          setLoading(false);
        })
        .catch(err => {
          setError('কোনো অর্ডার পাওয়া যায়নি।');
          setLoading(false);
        });
    }
  }, [id, order]);

  if (loading) {
    return <div className="p-6 text-center text-gray-600 text-lg">লোড হচ্ছে...</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-gray-600 text-lg">{error}</div>;
  }
  if (!order) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6 text-center text-gray-600 text-lg"
      >
        কোনো অর্ডার পাওয়া যায়নি।
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 p-6"
    >
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-8 text-center transform transition-all">
        {/* Animated Checkmark Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <FaCheckCircle className="text-6xl text-green-500 animate-pulse" />
        </motion.div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4 text-green-600 tracking-tight">
          আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে।
        </h1>

        {/* Confirmation Message */}
        <p className="text-gray-600 mb-6 text-lg">
          আমাদের কল সেন্টার থেকে ফোন করে আপনার অর্ডারটি কনফার্ম করা হবে।
        </p>

        {/* Order Details Card */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 gap-4 text-left text-gray-700">
            <div className="flex items-center">
              <span className="font-semibold w-32">অর্ডার নম্বর:</span>
              <span className="font-bold text-gray-900">{order.id}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-32">নাম:</span>
              <span>{order.name}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-32">ফোন:</span>
              <span>{order.phone}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-32">ঠিকানা:</span>
              <span>{order.address}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-32">অর্ডারের মোট মূল্য:</span>
              <span className="font-bold text-green-600">BDT {Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <Link
          to="/"
          className="inline-block bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          হোমে ফিরে যান
        </Link>
      </div>
    </motion.div>
  );
}