import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';


export default function ProductList() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlSearch = params.get('search') || '';
  const [search, setSearch] = useState(urlSearch);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    setLoading(true);
    fetch('/api/products')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filter products by search and only show active products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes((search || '').toLowerCase());
    const isActive = product.active === 1 || product.active === true;
    return matchesSearch && isActive;
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">All Products</h1>
      </div>
      {loading ? (
        <div className="my-6">Loading...</div>
      ) : error ? (
        <div className="my-6 text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No products found.</div>
          ) : (
            filteredProducts.map(product => (
              <Link to={`/product/${product.id}`} key={product.id} className="bg-white p-4 rounded shadow flex flex-col hover:shadow-lg transition">
                <img src={product.image || '/placeholder.png'} alt={product.name} className="w-full h-32 object-cover rounded mb-2" />
                <div className="font-semibold mb-1">{product.name}</div>
                <div className="text-blue-600 font-bold mb-1">৳{product.price}</div>
                <button className="bg-blue-600 text-white px-2 py-1 rounded">Details</button>
              </Link>
            ))
          )}
        </div>
      )}
      {/* Pagination can be added here if needed */}
    </div>
  );
} 