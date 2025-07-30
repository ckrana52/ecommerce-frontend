import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { addToCart } from '../utils/cart';

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleBeforeUnload = () => window.scrollTo(0, 0);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [id]);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => {
        try { data.variants = typeof data.variants === 'string' ? JSON.parse(data.variants) : data.variants; } catch { data.variants = []; }
        try { data.sizeList = typeof data.sizeList === 'string' ? JSON.parse(data.sizeList) : data.sizeList; } catch { data.sizeList = []; }
        try { data.colorList = typeof data.colorList === 'string' ? JSON.parse(data.colorList) : data.colorList; } catch { data.colorList = []; }
        try { data.weightList = typeof data.weightList === 'string' ? JSON.parse(data.weightList) : data.weightList; } catch { data.weightList = []; }

        setProduct(data);
        fetch(`/api/categories/${data.category_id}`)
          .then(res => res.json())
          .then(setCategory);
        return fetch(`/api/products?category_id=${data.category_id}`);
      })
      .then(res => res.json())
      .then(relatedData => {
        const filtered = relatedData.filter(p => p.id !== parseInt(id)).slice(0, 4);
        setRelatedProducts(filtered);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    alert(`${quantity} item(s) added to cart!`);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/checkout');
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="flex justify-center items-center min-h-screen"><div className="text-center"><h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2><p className="text-gray-600">{error}</p></div></div>;
  if (!product) return null;

  const productImages = Array.isArray(product.images)
    ? product.images
    : (product.images ? (() => { try { return JSON.parse(product.images); } catch { return [product.image || '/placeholder.png']; } })() : [product.image || '/placeholder.png']);

  let variantPrice = product?.price;
  const totalPrice = variantPrice * quantity;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                <img src={productImages[selectedImage] || '/placeholder.png'} alt={product.name} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex gap-3">
              {productImages.map((img, index) => (
                <button key={index} onClick={() => setSelectedImage(index)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-blue-500' : 'border-gray-200'}`}>
                  <img src={img || '/placeholder.png'} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            {product.variants && Array.isArray(product.variants) && product.variants.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Available Variants</h2>
                {product.variants.map((variant, idx) => (
                  <div key={idx} className="flex justify-between border p-2 rounded">
                    <span>{variant.name}</span>
                    <span className="font-bold text-green-600">৳ {variant.price}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-bold text-blue-600">৳{totalPrice}</span>
                <span className="text-xl text-gray-500 line-through">৳{Math.floor(totalPrice * 1.2)}</span>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-gray-100">-</button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-gray-100">+</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={handleAddToCart} className="bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">🛒 Add to Cart</button>
                <button onClick={handleBuyNow} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">Order Now</button>
              </div>
            </div>
          </div>
        </div>

        {product.description && (
          <div className="bg-white rounded-2xl shadow-lg mb-12 p-6">
            <h3 className="text-xl font-semibold mb-4">Product Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        )}

        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate(`/product/${relatedProduct.id}`)}>
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <img src={relatedProduct.image || '/placeholder.png'} alt={relatedProduct.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600">{relatedProduct.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600">৳{relatedProduct.price}</span>
                      <button onClick={(e) => { e.stopPropagation(); addToCart(relatedProduct); alert('Added to cart!'); }} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">🛒</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
