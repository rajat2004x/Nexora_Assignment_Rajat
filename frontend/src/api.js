// src/api.js
const BASE_URL = "http://localhost:5000/api";

// Fetch all products
export async function fetchProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

// Fetch cart
export async function fetchCart() {
  const res = await fetch(`${BASE_URL}/cart`);
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}

// Add to cart
export async function addToCart(productId, qty) {
  const res = await fetch(`${BASE_URL}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, qty }),
  });
  if (!res.ok) throw new Error("Failed to add to cart");
  return res.json();
}

// Remove item from cart
export async function removeFromCart(id) {
  const res = await fetch(`${BASE_URL}/cart/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove from cart");
  return res.json();
}

//  Update quantity
export async function updateCartItem(productId, qty) {
  const res = await fetch(`${BASE_URL}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, qty }),
  });
  if (!res.ok) throw new Error("Failed to update item");
  return res.json();
}

//  Checkout
export async function checkout(data) {
  const res = await fetch(`${BASE_URL}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Checkout failed");
  return res.json();
}
