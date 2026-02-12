const express = require("express");
const router = express.Router();

const controller = require("../controllers/orderController");
const auth = require("../middleware/auth");
const requireAdmin = require("../middleware/requireAdmin");

// USER
router.post("/", auth, controller.createOrder);
router.get("/my", auth, controller.getMyOrders);

// ADMIN
router.get("/", auth, requireAdmin, controller.getAllOrders);
router.put("/:id/status", auth, requireAdmin, controller.updateOrderStatus);

module.exports = router;