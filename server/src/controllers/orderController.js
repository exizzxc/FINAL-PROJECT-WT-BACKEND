const Order = require("../models/Order");

// CREATE ORDER
exports.createOrder = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const formattedItems = items.map(item => ({
      product: item.id,
      name: item.title,
      price: item.price,
      quantity: item.qty
    }));

    const totalAmount = formattedItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    const order = await Order.create({
      user: req.user.id,
      items: formattedItems,
      totalAmount
    });

    res.status(201).json(order);
  } catch (e) {
    next(e);
  }
};

// GET MY ORDERS
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("user", "email")
      .populate("items.product", "name price");

    res.json(orders);
  } catch (e) {
    next(e);
  }
};

// ADMIN: GET ALL ORDERS
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user", "email")
      .populate("items.product", "name price");

    res.json(orders);
  } catch (e) {
    next(e);
  }
};

// ADMIN: UPDATE STATUS
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (e) {
    next(e);
  }
};
