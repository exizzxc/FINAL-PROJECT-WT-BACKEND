

# 🛒 AITU-Tech Backend
Advanced Backend Development – Final Project

---

## 📌 Project Overview

This project is a fully functional REST API built using:

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Role-Based Access Control (RBAC)

The system implements a secure backend for an e-commerce platform with:

✔ User Authentication
✔ Admin Authorization
✔ Products & Categories (relational structure)
✔ Orders with backend price calculation
✔ Data validation & relational integrity
✔ MVC architecture
✔ Error handling middleware

---

# 🏗 Architecture (MVC Pattern)

The project follows a clean Model-View-Controller structure:

```
src/
 ├── models/
 │   ├── User.js
 │   ├── Product.js
 │   ├── Category.js
 │   └── Order.js
 │
 ├── controllers/
 │   ├── authController.js
 │   ├── productsController.js
 │   ├── categoriesController.js
 │   └── orderController.js
 │
 ├── middleware/
 │   ├── requireAuth.js
 │   ├── requireAdmin.js
 │   └── errorHandler.js
 │
 ├── routes/
 │   ├── authRoutes.js
 │   ├── productRoutes.js
 │   ├── categoryRoutes.js
 │   └── orderRoutes.js
 │
 └── app.js
```

---

# 🔐 Authentication & Authorization

## JWT Authentication

- Passwords are hashed using bcrypt
- JWT tokens are signed using JWT_SECRET
- Token payload includes:

```
{
  id,
  email,
  role
}
```

---

## 🛡 Role-Based Access Control (RBAC)

Admin-only routes:

- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id
- POST /api/categories
- PUT /api/categories/:id
- DELETE /api/categories/:id

Authorization is handled via requireAdmin middleware.

---

# 🗂 Data Models

## User

```
{
  email: String,
  password: String (hashed),
  role: "user" | "admin"
}
```

## Category

```
{
  name: String,
  description: String
}
```

## Product

```
{
  name: String,
  price: Number,
  description: String,
  imageUrl: String,
  categoryId: ObjectId (ref: Category)
}
```

## Order

```
{
  userId: ObjectId (ref: User),
  items: [
    {
      productId: ObjectId,
      qty: Number
    }
  ],
  total: Number,
  status: String
}
```

---

# 🔗 Relational Integrity

✔ Product validates that category exists before creation.

✔ Category cannot be deleted if products are linked.

✔ Order validates that products exist.

✔ Order total is calculated on backend (not from frontend data).

✔ userId in order is extracted from JWT.

---

# 📡 API Endpoints

## Authentication

POST /api/auth/register  – Register user
POST /api/auth/login     – Login and receive JWT

---

## Products

GET    /api/products           – Public
GET    /api/products/:id       – Public
POST   /api/products           – Admin
PUT    /api/products/:id       – Admin
DELETE /api/products/:id       – Admin

---

## Categories

GET    /api/categories         – Public
POST   /api/categories         – Admin
PUT    /api/categories/:id     – Admin
DELETE /api/categories/:id     – Admin

---

## Orders

POST   /api/orders             – Authenticated user
GET    /api/orders/my          – Authenticated user
GET    /api/orders             – Admin

---

# ⚙ Installation Guide

1. Clone repository:

```
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd server
```

2. Install dependencies:

```
npm install
```

3. Create .env file:

```
PORT=3000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
```

4. Start server:

```
npm run dev
```

Server runs at:

http://localhost:3000

---

# 🚀 Deployment

Backend deployed on Render / Railway.

MongoDB hosted on MongoDB Atlas.

Environment variables configured in hosting platform.

---

# 🧪 Testing

The API was tested using Postman collection including:

- Authentication tests
- Admin route protection
- CRUD operations
- Order creation
- Role validation

---

# 🎓 Academic Requirements Covered

✔ MVC architecture
✔ JWT authentication
✔ RBAC authorization
✔ CRUD for two related models
✔ Relational integrity
✔ Backend total calculation
✔ Error handling middleware
✔ Deployment

