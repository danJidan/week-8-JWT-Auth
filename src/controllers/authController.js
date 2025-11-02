const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
  const { username, password } = req.body;

  // Validasi input
  if (!username || !password)
    return res.status(400).json({ message: 'Username dan password wajib diisi!' });

  // Cek apakah username sudah ada
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Terjadi kesalahan server' });
    if (results.length > 0)
      return res.status(400).json({ message: 'Username sudah digunakan!' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword],
      (err) => {
        if (err) return res.status(500).json({ message: 'Gagal menyimpan user' });
        res.status(201).json({ message: 'Registrasi berhasil!' });
      }
    );
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Terjadi kesalahan server' });
    if (results.length === 0)
      return res.status(404).json({ message: 'User tidak ditemukan' });

    const user = results[0];

    // Cek kecocokan password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Password salah' });

    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ message: 'Login berhasil!', token });
  });
};
