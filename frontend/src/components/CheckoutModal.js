import React, { useState } from 'react';

export default function CheckoutModal({ onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ name, email });
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Checkout</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input required value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div>
            <label>Email</label>
            <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Place Order</button>
          </div>
        </form>
      </div>
    </div>
  );
}
