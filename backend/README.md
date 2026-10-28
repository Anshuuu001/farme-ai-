# AgriVision AI — Backend Service

The AgriVision AI backend is a modular Node.js + Express REST API providing secure JWT authentication, MySQL persistence, memory-safe image validation, and local MobileNetV2 ONNX neural network inference for tomato leaf disease detection.

---

## 🏗 Architecture & Technologies

- **Runtime**: Node.js (v18+)
- **HTTP Framework**: Express.js with CORS and JSON parsing
- **Database**: MySQL (relational schema with foreign keys and cascade rules via `mysql2/promise`)
- **Authentication**: Stateless JSON Web Tokens (`jsonwebtoken`) + Salted bcrypt password hashing (`bcryptjs`)
- **Image Validation**: `multer` (memory-buffered 10MB limit) + `sharp` (deep magic-byte inspection to prevent spoofed uploads)
- **Local AI Inference Engine**: `onnxruntime-node` executing pre-trained `MobileNetV2` on CPU (<35ms latency)

---

## 🗄 Database Schema (`agrivision_db`)

The database uses 2 relational tables with foreign keys and indexes:

1. **`users` Table**:
   - `id` (INT, Primary Key, Auto Increment)
   - `name` (VARCHAR(120), Required)
   - `email` (VARCHAR(180), Unique Index)
   - `password_hash` (VARCHAR(255), bcrypt hash)
   - `role` (VARCHAR(60), Default 'Field Agronomist')
   - `created_at`, `updated_at` (TIMESTAMP)

2. **`scans` Table**:
   - `id` (VARCHAR(64), Primary Key)
   - `user_id` (INT, Foreign Key referencing `users(id)` ON DELETE CASCADE)
   - `image_name` (VARCHAR(255))
   - `image_path` (VARCHAR(500), Safe local WebP reference)
   - `disease_key` (VARCHAR(64), Indexed)
   - `disease_name` (VARCHAR(120))
   - `scientific_name` (VARCHAR(120))
   - `severity` (VARCHAR(40))
   - `confidence` (FLOAT)
   - `is_healthy` (BOOLEAN)
   - `created_at` (TIMESTAMP, Indexed with user_id)

---

## 🔐 Environment Configuration

Create a `.env` file in `backend/` based on `.env.example`:

```env
PORT=5000
NODE_ENV=development

# MySQL Database Connection
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=agrivision_db

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

> **Security Note**: Never commit `.env` to git. `backend/.gitignore` excludes `.env` and `uploads/`.

---

## 🚀 Setup & Run Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Run Database Migrations
Creates the `agrivision_db` database and sets up the `users` and `scans` tables:
```bash
npm run migrate
```

### 3. Run Automated Tests
Executes the 19 integration tests covering authentication, upload spoofing, SQL ownership isolation, and ONNX inference:
```bash
npm test
```

### 4. Start the Backend Server
```bash
# Production start
npm start

# Or development watch mode
npm run dev
```
The API starts on `http://localhost:5000`. Health-check is available at `http://localhost:5000/api/health`.

---

## 📡 REST API Reference

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/health` | No | System health and MySQL connectivity status |
| `POST` | `/api/auth/register` | No | Register new user with bcrypt password hash |
| `POST` | `/api/auth/login` | No | Authenticate user, returns JWT Bearer token |
| `GET` | `/api/auth/me` | Yes (`Bearer <token>`) | Retrieve current user profile |
| `POST` | `/api/scans/detect` | Yes (`Bearer <token>`) | Multipart upload (`image`), runs ONNX inference, saves user scan |
| `GET` | `/api/scans/history` | Yes (`Bearer <token>`) | List all scans owned by authenticated user |
| `DELETE` | `/api/scans/:id` | Yes (`Bearer <token>`) | Delete user-owned scan (strict SQL ownership check) |
