

## Struktur Proyek

```
src/
	server.js
	config/
		db.js
	controllers/
		authController.js
	middleware/
		authMiddleware.js
	routes/
		authRoutes.js
		carRoutes.js
```

## Persiapan

1) Install dependencies

```powershell
npm install
```

2) Buat file `.env` di root (sejajar dengan `package.json`)

```env
# Server
PORT=3000
JWT_SECRET=supersecret_jwt_key

# Database
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=your_database
```

3) Inisialisasi Database (Contoh Skema)

Gunakan MySQL client (phpMyAdmin / MySQL Workbench / CLI) untuk membuat database dan tabel berikut:

```sql
CREATE DATABASE IF NOT EXISTS your_database;
USE your_database;

-- Tabel users
CREATE TABLE IF NOT EXISTS users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(100) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel cars
CREATE TABLE IF NOT EXISTS cars (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	brand VARCHAR(100) NOT NULL,
	price DECIMAL(12,2) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Menjalankan Aplikasi

```powershell
# Jalankan server
node src/server.js

# (Opsional) tambahkan script "start" di package.json agar bisa:
# npm start
```

Server akan berjalan di `http://localhost:3000` (atau port sesuai `.env`).


## Hasil Testing (Postman)

Berikut adalah hasil uji API menggunakan Postman, memanfaatkan gambar yang Anda lampirkan:

| Langkah | Deskripsi | Gambar |
|---|---|---|
| 1 | GET `/api/cars` tanpa prefix `Bearer` → 401 Unauthorized, pesan: "Token tidak ditemukan!" | ![GET cars tanpa Bearer - 401](Screenshot%202025-11-02%20210328.png) |
| 2 | GET `/api/cars` dengan header `Authorization: Bearer <JWT>` → 200 OK, body `[]` | ![GET cars dengan Bearer - 200](Screenshot%202025-11-02%20210444.png) |
| 3 | POST `/api/auth/register` dengan username yang sudah ada → 400, pesan: "Username sudah digunakan!" | ![Register duplicate - 400](Screenshot%202025-11-02%20214331.png) |
| 4 | POST `/api/auth/login` → 200 OK, mengembalikan token JWT | ![Login success - 200](Screenshot%202025-11-02%20214344.png) |
| 5 | GET `/api/cars` (authorized) → 200 OK, data array mobil | ![GET cars data - 200](Screenshot%202025-11-02%20214401.png) |
| 6 | POST `/api/cars` (authorized) → 200 OK, pesan: "Mobil berhasil ditambahkan!" | ![POST cars success - 200](Screenshot%202025-11-02%20214414.png) |

> Catatan: Nama file gambar mengikuti yang ada di repository. Jika ingin mengubah urutan/caption, cukup edit tabel di atas.

## Catatan Tambahan

- Pastikan nilai `JWT_SECRET` dan kredensial database di `.env` sudah benar.
- Jika ingin mempermudah start, tambahkan script berikut di `package.json`:
	```json
	{
		"scripts": {
			"start": "node src/server.js",
			"dev": "nodemon src/server.js"
		}
	}
	```
- Endpoint dan response di README ini sinkron dengan implementasi pada `src/controllers/authController.js`, `src/middleware/authMiddleware.js`, dan `src/routes/*`.

---

Dibuat pada 3 November 2025.
