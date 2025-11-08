import React from "react";
import "./Products.css";

export default function Products({ products, onAdd }) {
  if (!products || products.length === 0)
    return <p style={{ textAlign: "center" }}>No products available</p>;

  return (
    <section className="products-section">
      <h2>🛍️ Our Featured Products</h2>
      <div className="products-grid">
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            <div className="product-img">
              <img
                src={
                  p.image && p.image.trim() !== ""
                    ? p.image
                    : "https://via.placeholder.com/250x200?text=No+Image"
                }
                alt={p.name || "Product Image"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/250x200?text=Image+Not+Available";
                }}
              />
              <span className="discount-badge">🔥 20% OFF</span>
            </div>
            <h4>{p.name || "Unnamed Product"}</h4>
            <p className="price">₹{p.price ?? "N/A"}</p>
            <button className="add-btn" onClick={() => onAdd(p.id)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
