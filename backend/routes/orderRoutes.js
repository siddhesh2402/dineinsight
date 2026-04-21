const express = require("express")
const router = express.Router()

const {
  getOrders,
  createOrder,
  updateOrderStatus,
} = require("../controllers/orderController")

const authMiddleware = require("../middleware/authMiddleware")

router.get("/", authMiddleware, getOrders)
router.post("/", authMiddleware, createOrder)
router.put("/:id", authMiddleware, updateOrderStatus)

module.exports = router