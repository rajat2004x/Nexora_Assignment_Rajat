const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

// Database setup
const DB_FILE = path.join(__dirname, 'db.sqlite');
const db = new sqlite3.Database(DB_FILE);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ----------------------------------------------
// DATABASE INITIALIZATION & SEEDING
// ----------------------------------------------
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT,
    price REAL,
    image TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId TEXT,
    qty INTEGER,
    addedAt INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS receipts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    receiptId TEXT,
    data TEXT,
    total REAL,
    createdAt INTEGER
  )`);

  db.get('SELECT COUNT(*) as c FROM products', (err, row) => {
    if (err) return console.error(err);
    if (row.c === 0) {
      const stmt = db.prepare('INSERT INTO products (id, name, price, image) VALUES (?, ?, ?, ?)');
      const items = [
        ['p1', 'Vibe T-Shirt', 499, 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80'],
        ['p2', 'Vibe Hoodie', 1299, 'https://images.unsplash.com/photo-1618354691373-f3e4a1c9c255?auto=format&fit=crop&w=600&q=80'],
        ['p3', 'Vibe Cap', 299, 'https://images.unsplash.com/photo-1592878904946-b3cd8d49a3e0?auto=format&fit=crop&w=600&q=80'],
        ['p4', 'Vibe Backpack', 1999, 'https://images.unsplash.com/photo-1598032784212-9f6ab9a9b9ad?auto=format&fit=crop&w=600&q=80'],
        ['p5', 'Vibe Mug', 199, 'https://images.unsplash.com/photo-1616401784763-7fc8f6fef578?auto=format&fit=crop&w=600&q=80']
      ];
      items.forEach(i => stmt.run(...i));
      stmt.finalize();
      console.log('✅ Seeded products with images');
    }
  });
});

// ----------------------------------------------
// ROUTES
// ----------------------------------------------

//  GET /api/products
app.get('/api/products', (req, res) => {
  db.all('SELECT id, name, price, image FROM products', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

//  GET /api/cart
app.get('/api/cart', (req, res) => {
  const query = `
    SELECT cart.id as id, cart.productId, cart.qty, products.name, products.price, products.image
    FROM cart
    LEFT JOIN products ON cart.productId = products.id
  `;
  db.all(query, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    let total = 0;
    const items = rows.map(r => {
      const subtotal = (r.price || 0) * r.qty;
      total += subtotal;
      return {
        id: r.id,
        productId: r.productId,
        name: r.name,
        price: r.price,
        qty: r.qty,
        subtotal,
        image: r.image
      };
    });

    res.json({ items, total });
  });
});

// POST /api/cart
app.post('/api/cart', (req, res) => {
  const { productId, qty } = req.body;
  if (!productId || !qty || qty <= 0)
    return res.status(400).json({ error: 'Invalid input' });

  db.get('SELECT id, qty FROM cart WHERE productId = ?', [productId], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (row) {
      const newQty = row.qty + qty;
      db.run('UPDATE cart SET qty = ? WHERE id = ?', [newQty, row.id], function (e) {
        if (e) return res.status(500).json({ error: 'Database error' });
        res.json({ id: row.id, productId, qty: newQty });
      });
    } else {
      db.run(
        'INSERT INTO cart (productId, qty, addedAt) VALUES (?, ?, ?)',
        [productId, qty, Date.now()],
        function (e) {
          if (e) return res.status(500).json({ error: 'Database error' });
          res.status(201).json({ id: this.lastID, productId, qty });
        }
      );
    }
  });
});

// PUT /api/cart/:id — update quantity
app.put('/api/cart/:id', (req, res) => {
  const id = req.params.id;
  const { qty } = req.body;
  if (!qty || qty <= 0) return res.status(400).json({ error: 'Invalid quantity' });

  db.run('UPDATE cart SET qty = ? WHERE id = ?', [qty, id], function (err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ id, qty });
  });
});

//  DELETE /api/cart/:id
app.delete('/api/cart/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM cart WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  });
});

// POST /api/checkout
app.post('/api/checkout', (req, res) => {
  const { cartItems } = req.body;
  if (!Array.isArray(cartItems) || cartItems.length === 0)
    return res.status(400).json({ error: 'Cart is empty' });

  const productIds = cartItems.map(ci => ci.productId);
  const placeholders = productIds.map(() => '?').join(',');

  db.all(`SELECT id, price, name FROM products WHERE id IN (${placeholders})`, productIds, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    const priceMap = {};
    rows.forEach(r => (priceMap[r.id] = { price: r.price, name: r.name }));

    let total = 0;
    const detailed = cartItems.map(ci => {
      const product = priceMap[ci.productId];
      const price = product ? product.price : 0;
      const name = product ? product.name : 'Unknown';
      const subtotal = price * ci.qty;
      total += subtotal;
      return { productId: ci.productId, name, qty: ci.qty, price, subtotal };
    });

    const receiptId = uuidv4();
    const receipt = { receiptId, items: detailed, total, timestamp: Date.now() };

    db.run(
      'INSERT INTO receipts (receiptId, data, total, createdAt) VALUES (?, ?, ?, ?)',
      [receiptId, JSON.stringify(receipt), total, Date.now()],
      function (e) {
        if (e) console.error(e);

        // clear cart
        db.run('DELETE FROM cart', [], dErr => {
          if (dErr) console.error(dErr);
          res.json({ receipt });
        });
      }
    );
  });
});

// ----------------------------------------------
// START SERVER
// ----------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);

