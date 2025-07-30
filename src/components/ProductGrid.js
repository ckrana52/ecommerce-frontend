import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag } from 'react-icons/fa';
import { addToCart } from '../utils/cart';

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/products')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        // Support array or object response
        let arr = Array.isArray(data) ? data : (data.products || data.data || []);
        setProducts(arr);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Only show active products
  const activeProducts = products.filter(product =>
    product.active === 1 || product.active === true || product.active === "1" || product.active === "true"
  );

  // ক্যাটাগরি নাম বের করুন (যদি ফিল্টার করা থাকে)
  const urlParams = new URLSearchParams(window.location.search);
  const categoryName = urlParams.get('category') || '';

  // ক্যাটাগরি ফিল্টার
  const categoryId = urlParams.get('category_id');
  const filteredProducts = categoryId
    ? activeProducts.filter(product => String(product.category_id) === String(categoryId))
    : activeProducts;

  if (loading) return <div className="my-6">Loading...</div>;
  if (error) return <div className="my-6 text-red-500">{error}</div>;

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">{categoryName ? categoryName : 'Category'}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filteredProducts.map(product => {
          const isOutOfStock = product.stock !== undefined && Number(product.stock) <= 0;
          return (
            <Link to={`/product/${product.id}`} key={product.id} className="block h-full">
              <div className="bg-white rounded-xl shadow-lg p-4 relative group transition hover:shadow-2xl">
                {/* স্টক আউট ব্যাজ */}
                {isOutOfStock && (
                  <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-tl-xl rounded-br-xl z-20">Stock Out</span>
                )}
                {/* ডিসকাউন্ট ব্যাজ */}
                {product.old_price && product.price && product.old_price > product.price && !isOutOfStock && (
                  <span className="absolute top-3 left-3 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-tl-xl rounded-br-xl z-10">-
                    {product.old_price - product.price}৳
                  </span>
                )}
                {/* লাভ/ফেভারিট বাটন */}
                <button className="absolute top-3 right-3 bg-white border border-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-pink-500 shadow hover:bg-pink-50 z-10">♥</button>
                {/* প্রোডাক্ট ইমেজ */}
                <img src={product.image || '/placeholder.png'} alt={product.name} className="w-full object-contain rounded-xl mb-3 bg-gray-50" />
                {/* ক্যাটাগরি */}
                <div className="text-xs text-gray-400 mb-1">{product.category_name || 'Category'}</div>
                {/* নাম */}
                <div className="font-bold text-base mb-1 line-clamp-2 min-h-[40px]">{product.name}</div>
                {/* রেটিং (ডাইনামিক) */}
                <div className="flex items-center gap-1 text-yellow-400 text-xs mb-1">
                  {Array.from({length: Math.round(product.rating || 0)}).map((_,i) => <span key={i}>★</span>)}
                  {Array.from({length: 5 - Math.round(product.rating || 0)}).map((_,i) => <span key={i} className="text-gray-300">★</span>)}
                </div>
                {/* প্রাইস ও পুরাতন প্রাইস */}
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-lg font-extrabold text-purple-700 flex items-baseline"><span className='mr-1 font-extrabold' style={{fontSize:'inherit',lineHeight:'1',display:'inline-block'}}>৳</span>{product.price}</span>
                  {product.old_price && product.old_price > product.price && (
                    <span className="text-sm text-gray-400 line-through flex items-baseline"><span className='mr-1 font-extrabold' style={{fontSize:'inherit',lineHeight:'1',display:'inline-block'}}>৳</span>{product.old_price}</span>
                  )}
                </div>
                {/* কার্ট বাটন */}
                <div className="absolute bottom-3 right-3">
                  <div className="relative group">
                    <button
                      className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition text-xl font-bold relative ${isOutOfStock ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                      disabled={isOutOfStock}
                      title={isOutOfStock ? 'Out of Stock' : 'Add To Cart'}
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!isOutOfStock) {
                          addToCart(product);
                        }
                      }}
                    >
                      <FaShoppingBag />
                    </button>
                    {/* Tooltip with animation */}
                    <div className={`
                      absolute left-1/2 -translate-x-1/2 bottom-12
                      px-3 py-1 rounded text-xs font-bold text-white
                      whitespace-nowrap z-30 pointer-events-none
                      transition-all duration-300
                      opacity-0 translate-y-2
                      group-hover:opacity-100 group-hover:translate-y-0
                      ${isOutOfStock ? 'bg-orange-500' : 'bg-purple-600'}
                    `}>
                      {isOutOfStock ? 'Out of stock' : 'Add to Cart'}
                      {/* Arrow */}
                      <span className={`
                        absolute left-1/2 -translate-x-1/2 top-full
                        w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent
                        ${isOutOfStock ? 'border-t-orange-500' : 'border-t-purple-600'}
                      `}></span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function ProductCard({ product }) {
  const isOutOfStock = product.stock !== undefined && Number(product.stock) <= 0;
  return (
    <Link to={`/product/${product.id}`} key={product.id} className="block h-full">
      <div className="bg-white rounded-xl shadow-lg p-4 relative group transition hover:shadow-2xl">
        {/* স্টক আউট ব্যাজ */}
        {isOutOfStock && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-tl-xl rounded-br-xl z-20">Stock Out</span>
        )}
        {/* ডিসকাউন্ট ব্যাজ */}
        {product.old_price && product.price && product.old_price > product.price && !isOutOfStock && (
          <span className="absolute top-3 left-3 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-tl-xl rounded-br-xl z-10">-
            {product.old_price - product.price}৳
          </span>
        )}
        {/* লাভ/ফেভারিট বাটন */}
        <button className="absolute top-3 right-3 bg-white border border-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-pink-500 shadow hover:bg-pink-50 z-10">♥</button>
        {/* প্রোডাক্ট ইমেজ */}
        <img src={product.image || '/placeholder.png'} alt={product.name} className="w-full object-contain rounded-xl mb-3 bg-gray-50" />
        {/* ক্যাটাগরি */}
        <div className="text-xs text-gray-400 mb-1">{product.category_name || 'Category'}</div>
        {/* নাম */}
        <div className="font-bold text-base mb-1 line-clamp-2 min-h-[40px]">{product.name}</div>
        {/* রেটিং (ডাইনামিক) */}
        <div className="flex items-center gap-1 text-yellow-400 text-xs mb-1">
          {Array.from({length: Math.round(product.rating || 0)}).map((_,i) => <span key={i}>★</span>)}
          {Array.from({length: 5 - Math.round(product.rating || 0)}).map((_,i) => <span key={i} className="text-gray-300">★</span>)}
        </div>
        {/* প্রাইস ও পুরাতন প্রাইস */}
        <div className="flex items-end gap-2 mb-2">
          <span className="text-lg font-extrabold text-purple-700 flex items-baseline"><span className='mr-1 font-extrabold' style={{fontSize:'inherit',lineHeight:'1',display:'inline-block'}}>৳</span>{product.price}</span>
          {product.old_price && product.old_price > product.price && (
            <span className="text-sm text-gray-400 line-through flex items-baseline"><span className='mr-1 font-extrabold' style={{fontSize:'inherit',lineHeight:'1',display:'inline-block'}}>৳</span>{product.old_price}</span>
          )}
        </div>
        {/* কার্ট বাটন */}
        <div className="absolute bottom-3 right-3">
          <div className="relative group">
            <button
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition text-xl font-bold relative ${isOutOfStock ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
              disabled={isOutOfStock}
              title={isOutOfStock ? 'Out of Stock' : 'Add To Cart'}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                if (!isOutOfStock) {
                  addToCart(product);
                }
              }}
            >
              <FaShoppingBag />
            </button>
            {/* Tooltip with animation */}
            <div className={`
              absolute left-1/2 -translate-x-1/2 bottom-12
              px-3 py-1 rounded text-xs font-bold text-white
              whitespace-nowrap z-30 pointer-events-none
              transition-all duration-300
              opacity-0 translate-y-2
              group-hover:opacity-100 group-hover:translate-y-0
              ${isOutOfStock ? 'bg-orange-500' : 'bg-purple-600'}
            `}>
              {isOutOfStock ? 'Out of stock' : 'Add to Cart'}
              {/* Arrow */}
              <span className={`
                absolute left-1/2 -translate-x-1/2 top-full
                w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent
                ${isOutOfStock ? 'border-t-orange-500' : 'border-t-purple-600'}
              `}></span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
