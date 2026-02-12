const express = require("express");
const router = express.Router();

const controller = require("../controllers/categoriesController");
const auth = require("../middleware/auth");
const requireAdmin = require("../middleware/requireAdmin");

// PUBLIC
router.get("/", controller.getAll);
router.get("/:id", controller.getOne);

// ADMIN ONLY
router.post("/", auth, requireAdmin, controller.create);
router.put("/:id", auth, requireAdmin, controller.update);
router.delete("/:id", auth, requireAdmin, controller.remove);

module.exports = router;