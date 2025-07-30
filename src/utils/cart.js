// Add a product to cart
export function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cartUpdated'));
}

// Get all cart items
export function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

// Clear cart
export function clearCart() {
  localStorage.removeItem('cart');
} 