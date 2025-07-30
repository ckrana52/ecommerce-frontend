import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        // Ensure data is always an array
        const categoriesArray = Array.isArray(data)
          ? data
          : (data.categories || data.data || []);
        setCategories(categoriesArray);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="my-6">Loading...</div>;
  if (error) return <div className="my-6 text-red-500">{error}</div>;

  return (
    <div className=" py-2 px-2 md:px-0">
      <h2 className="text-2xl font-bold text-center text-gray-800">Featured Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 md:justify-center mt-[20px] gap-3 md:gap-5 gap-y-6 md:gap-y-5 ">
        {categories.map(category => (
          <Link to={`/products?category_id=${category.id}`} key={category.id} className="relative group category-card w-full h-56" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <div className="absolute top-0 left-0 right-0 bottom-0 gradient-border pointer-events-none" style={{zIndex:0, borderRadius:'16px', background:'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)', padding:'2px'}}></div>
            <div className="card-content flex flex-col items-center justify-center space-y-2 p-4 bg-white h-full relative z-10 shadow transition-transform duration-300" style={{ borderRadius: '16px', height: '100%' }}>
              <img src={category.image || '/placeholder.png'} alt={category.name} className="category-image w-28 h-28 object-contain rounded-lg transition-transform duration-300" />
              <h3 className="text-lg font-semibold text-center text-gray-800">{category.name}</h3>
              <i className="fas fa-cat cat-icon absolute top-3 right-3 text-2xl text-gray-400 opacity-70 group-hover:opacity-100 transition-opacity duration-300"></i>
            </div>
          </Link>
        ))}
      </div>
      <style>{`
        .category-card { transition: transform 0.3s, box-shadow 0.3s; overflow: visible; border-radius: 16px; }
        .category-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.15); }
        .gradient-border { border-radius: 16px !important; }
        .card-content { border-radius: 16px !important; }
        .category-image { transition: transform 0.3s; }
        .category-card:hover .category-image { transform: scale(1.05); }
        .cat-icon { transition: opacity 0.3s; }
      `}</style>
    </div>
  );
}
