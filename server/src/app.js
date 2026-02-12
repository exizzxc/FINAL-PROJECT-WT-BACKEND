require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const productsRoutes = require("./routes/products");
const categoriesRoutes = require("./routes/categories");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");

const errorHandler = require("./middleware/errorHandler");

const app = express();

// middlewares
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/orders", orderRoutes);

app.use(express.static(path.join(__dirname, "../public")));

// error handler
app.use(errorHandler);

// connect db + start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 3000, () =>
      console.log("✅ Server running")
    );
  })
  .catch((err) => console.error("Mongo error:", err));
