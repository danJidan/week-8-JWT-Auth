const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticateToken = require('../middleware/authMiddleware');

// Ambil semua data mobil (hanya bisa diakses oleh user login)
router.get('/', authenticateToken, (req, res) => {
  db.query('SELECT * FROM cars', (err, results) => {
    if (err) return res.status(500).json({ message: 'Gagal mengambil data mobil' });
    res.json(results);
  });
});

// Tambah data mobil (hanya bisa diakses oleh user login)
router.post('/', authenticateToken, (req, res) => {
  const { name, brand, price } = req.body;

  if (!name || !brand || !price)
    return res.status(400).json({ message: 'Semua field wajib diisi!' });

  db.query(
    'INSERT INTO cars (name, brand, price) VALUES (?, ?, ?)',
    [name, brand, price],
    (err) => {
      if (err) return res.status(500).json({ message: 'Gagal menambahkan data mobil' });
      res.json({ message: 'Mobil berhasil ditambahkan!' });
    }
  );
});

module.exports = router;
