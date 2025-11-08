import React from "react";
import "./Cart.css";

export default function Cart({
  items,
  total,
  onRemove,
  onUpdate,
  onCheckout,
  visible,
  onClose,
}) {
  return (
    <>
      {/* BACKDROP */}
      <div
        className={`cart-overlay ${visible ? "show" : ""}`}
        onClick={onClose}
      ></div>

      {/* SLIDING CART DRAWER */}
      <div className={`cart-drawer ${visible ? "open" : ""}`}>
        <div className="cart-header">
          <h3>🛒 Your Cart</h3>
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        {items.length === 0 ? (
          <p className="empty">Cart is empty</p>
        ) : (
          <>
            <ul className="cart-list">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-img"
                  />
                  <div className="cart-info">
                    <span className="item-name">{item.name}</span>
                    <div className="cart-controls">
                      <button onClick={() => onUpdate(item.id, item.qty - 1)}>
                        -
                      </button>
                      <span>{item.qty}</span>
                      <button onClick={() => onUpdate(item.id, item.qty + 1)}>
                        +
                      </button>
                    </div>
                    <span className="item-price">
                      Rs. {(item.price * item.qty).toFixed(2)}
                    </span>
                    <button
                      className="remove-btn"
                      onClick={() => onRemove(item.id)}
                    >
                      ✖
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-footer">
              <h4>Total: Rs. {total.toFixed(2)}</h4>
              <button className="checkout-btn" onClick={onCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
