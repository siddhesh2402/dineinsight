const express = require("express")
const router = express.Router()

const {
  getOrders,
  createOrder,
  updateOrderStatus,
} = require("../controllers/orderController")

const authMiddleware = require("../middleware/authMiddleware")

router.get("/", getOrders)
router.post("/", authMiddleware, createOrder)
router.put("/:id", updateOrderStatus)

module.exports = router