import Slider from '../components/Slider';
import CategoryGrid from '../components/CategoryGrid';
import ProductGrid from '../components/ProductGrid';
// import { FeatureBar } from '../components/Footer'; // Removed FeatureBar import
import Support from '../components/WhatsAppButton'; // Fix: import default as Support
import { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductGrid'; // <-- Fix: use named import for ProductCard

export default function Home() {
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [homepageTemplate, setHomepageTemplate] = useState('category');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Settings ফেচ করুন
    fetch('/api/settings/public?group=general')
      .then(res => res.json())
      .then(settingsArr => {
        let homepage = 'category';
        if (Array.isArray(settingsArr)) {
          const settings = {};
          settingsArr.forEach(item => { settings[item.key] = item.value; });
          homepage = settings.homepage_template || 'category';
        } else if (settingsArr && typeof settingsArr === 'object') {
          homepage = settingsArr.homepage_template || 'category';
        }
        setHomepageTemplate(homepage);
      });
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(res => res.json()),
      fetch('/api/products').then(res => res.json())
    ]).then(([categoriesRaw, productsRaw]) => {
      const categories = Array.isArray(categoriesRaw)
        ? categoriesRaw
        : (categoriesRaw.categories || categoriesRaw.data || []);
      let allProducts = Array.isArray(productsRaw) ? productsRaw : (productsRaw.products || productsRaw.data || []);
      // এখানে categories ফিল্ডকে array বানান
      allProducts = allProducts.map(p => ({
        ...p,
        categories: p.categories
          ? (typeof p.categories === 'string'
              ? (() => { try { return JSON.parse(p.categories); } catch { return []; } })()
              : p.categories)
          : []
      }));
      setAllProducts(allProducts);
      const categoryProducts = categories.map(cat => {
        const products = allProducts.filter(p =>
          (Array.isArray(p.categories) && (p.categories.includes(cat.id) || p.categories.includes(String(cat.id))))
          || String(p.category_id) === String(cat.id)
        );
        return { ...cat, products };
      }).filter(cat => cat.products.length > 0);
      setCategoryProducts(categoryProducts);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center text-lg">Loading...</div>;

  const activeProducts = allProducts.filter(product =>
    product.active === 1 || product.active === true || product.active === "1" || product.active === "true"
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-2">
        <Slider />
        <CategoryGrid />
        {/* হোমপেজ টেমপ্লেট অনুযায়ী কনটেন্ট */}
        {homepageTemplate === 'all' ? (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 mt-8 text-center text-blue-700">All Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {activeProducts.length === 0 ? (
                <div className="col-span-2 md:col-span-4 text-gray-400 italic">No products found.</div>
              ) : (
                activeProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          </section>
        ) : (
          // ক্যাটাগরি-ওয়াইজ
          categoryProducts.map(cat => (
            <section key={cat.id} className="mb-10">
              <h2 className="text-xl font-bold mb-4 mt-8">{cat.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {cat.products.length === 0 ? (
                  <div className="col-span-2 md:col-span-4 text-gray-400 italic">No products found.</div>
                ) : (
                  cat.products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))
                )}
              </div>
            </section>
          ))
        )}
      </div>
      {/* <FeatureBar /> */} {/* Removed FeatureBar usage */}
      <Support />
    </div>
  );
}
