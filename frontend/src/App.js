import React, { useEffect, useState } from "react";
import OffersCarousel from "./components/OffersCarousel";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  fetchProducts,
  fetchCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  checkout,
} from "./api";
import Products from "./components/Products";
import Cart from "./components/Cart";
import CheckoutModal from "./components/CheckoutModal";
import "./styles.css";




export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [toast, setToast] = useState(null); // ✅ NEW — Toast Notification

  async function load() {
    const p = await fetchProducts();
    setProducts(p);
    const c = await fetchCart();
    setCart(c);
  }

  useEffect(() => {
    AOS.init({ duration: 900, once: true, offset: 120 });
    load();
  }, []);

  async function handleAdd(id) {
    await addToCart(id, 1);
    const c = await fetchCart();
    setCart(c);
    setShowCart(true);

    // ✅Show toast for feedback
    setToast("✅ Added to Cart");
    setTimeout(() => setToast(null), 2000);
  }

  async function handleRemove(id) {
    await removeFromCart(id);
    const c = await fetchCart();
    setCart(c);
  }

  async function handleUpdate(id, qty) {
    if (qty <= 0) return;
    await updateCartItem(id, qty);
    const c = await fetchCart();
    setCart(c);
  }

  async function handleCheckout(details) {
    const payload = {
      cartItems: cart.items.map((i) => ({
        productId: i.productId,
        qty: i.qty,
      })),
      ...details,
    };
    const res = await checkout(payload);
    if (res.receipt) {
      setReceipt(res.receipt);
      setShowCheckout(false);
      setCart({ items: [], total: 0 });
    }
  }

  return (
    <div className="app">
      {/* NAVBAR */}
      <header className="navbar" data-aos="fade-down">
        <h2 className="logo">🛍️ Vibe Commerce</h2>
        <button className="cart-toggle" onClick={() => setShowCart(!showCart)}>
          🛒 Cart ({cart.items.length})
        </button>
      </header>

      {/* HERO SECTION */}
      <section className="hero" data-aos="zoom-in">
        <div className="hero-content">
          <h1>Shop the Vibe</h1>
          <p>Smart, Simple & Stylish — just like you.</p>
          <button
            className="cta-btn"
            onClick={() => window.scrollTo({ top: 700, behavior: "smooth" })}
          >
            Start Shopping
          </button>
        </div>
      </section>

      {/* AUTO-SLIDING OFFERS CAROUSEL */}
      <OffersCarousel />

      {/* WHY SHOP WITH US SECTION */}
      <section className="why-us" data-aos="fade-up">
        <h2>Why Shop With Us?</h2>
        <div className="why-grid">
          <div className="why-card" data-aos="fade-up" data-aos-delay="100">
            <h3>🚚 Fast Delivery</h3>
            <p>Lightning-fast shipping straight to your doorstep.</p>
          </div>
          <div className="why-card" data-aos="fade-up" data-aos-delay="200">
            <h3>💳 Secure Checkout</h3>
            <p>100% safe, reliable, and seamless shopping experience.</p>
          </div>
          <div className="why-card" data-aos="fade-up" data-aos-delay="300">
            <h3>🎁 Premium Quality</h3>
            <p>Top-quality products crafted with care and precision.</p>
          </div>
        </div>
      </section>

      {/* TRENDING NOW SECTION */}
      <section className="trending" data-aos="fade-up">
        <h2>🔥 Trending Now</h2>
        <div className="trending-grid">
          <div className="trend-card">
            <img
              src="https://images.unsplash.com/photo-1600180758890-6ee7e1b0c9c7?auto=format&fit=crop&w=800&q=80"
              alt="Hoodies"
            />
            <h3>Classic Hoodies</h3>
            <p>Soft cotton fits — up to 35% off</p>
          </div>
          <div className="trend-card">
            <img
              src="https://images.unsplash.com/photo-1618354691373-f3e4a1c9c255?auto=format&fit=crop&w=800&q=80"
              alt="Caps"
            />
            <h3>Street Caps</h3>
            <p>Top picks for urban style</p>
          </div>
          <div className="trend-card">
            <img
              src="https://images.unsplash.com/photo-1585386959984-a4155229c1f0?auto=format&fit=crop&w=800&q=80"
              alt="Watches"
            />
            <h3>Wrist Watches</h3>
            <p>Minimal and modern designs</p>
          </div>
          <div className="trend-card">
            <img
              src="https://images.unsplash.com/photo-1606813907293-94d4b2fa5c7f?auto=format&fit=crop&w=800&q=80"
              alt="Earbuds"
            />
            <h3>Wireless Earbuds</h3>
            <p>Noise-free, high-bass sound</p>
          </div>
        </div>
      </section>

      {/* MAIN PRODUCT + CART */}
      <div className="main">
        <Products products={products} onAdd={handleAdd} />
        <Cart
          items={cart.items}
          total={cart.total}
          onRemove={handleRemove}
          onUpdate={handleUpdate}
          onCheckout={() => setShowCheckout(true)}
          visible={showCart}
          onClose={() => setShowCart(false)} // Drawer close trigger
        />
      </div>

      {/* CHECKOUT MODAL */}
      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          onSubmit={handleCheckout}
        />
      )}

      {/* RECEIPT SECTION */}
      {receipt && (
        <div className="receipt" data-aos="fade-up">
          <h3>Order Confirmed ✅</h3>
          <p>
            <strong>Total:</strong> Rs. {receipt.total}
          </p>
          <p>
            <strong>Time:</strong>{" "}
            {new Date(receipt.timestamp).toLocaleString()}
          </p>
        </div>
      )}

      {/*  TOAST NOTIFICATION */}
      {toast && <div className="toast">{toast}</div>}

      {/* FOOTER */}
      <footer className="footer" data-aos="fade-up">
        <p>© 2025 Vibe Commerce. Crafted by Rajat Kumar Singh.</p>
      </footer>
    </div>
  );
}
