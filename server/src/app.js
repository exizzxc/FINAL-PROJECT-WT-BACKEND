const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const mongoose = require("mongoose");

const productsRoutes = require("./routes/products");
const categoriesRoutes = require("./routes/categories");
const authRoutes = require("./routes/auth");

const errorHandler = require("./middleware/errorHandler");

const orderRoutes = require("./routes/orders");

const app = express();

// middlewares
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use(express.static(path.join(__dirname, "../public")));
app.use("/api/orders", orderRoutes);

// error handler
app.use(errorHandler);

// db connect + start
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(3000, () => console.log("✅ Server running on port 3000"));
  })
  .catch((err) => console.error("Mongo error:", err));