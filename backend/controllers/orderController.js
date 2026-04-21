const Order = require("../models/Order")

const getOrders = async (req, res) => {
  try {
    let filter = {}

    if (req.user.role !== "admin") {
      filter.email = req.user.email
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 })
    res.status(200).json(orders)
  } catch (error) {
    console.error("Get orders error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const createOrder = async (req, res) => {
  try {
    const { customerName, phone, address, items } = req.body

    if (
      !phone ||
      !address ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        message: "Phone, address, and at least one item are required",
      })
    }

    const normalizedItems = items.map((item) => ({
      foodId: item._id || item.foodId,
      name: item.name,
      price: Number(item.price),
      qty: Number(item.qty),
      image: item.image || "",
    }))

    const totalItems = normalizedItems.reduce((sum, item) => sum + item.qty, 0)
    const totalCost = normalizedItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    )

    const order = await Order.create({
      customerName: customerName || req.user.name || "User",
      email: req.user.email,
      phone,
      address,
      items: normalizedItems,
      totalItems,
      totalCost,
      status: "Placed",
    })

    res.status(201).json(order)
  } catch (error) {
    console.error("Create order error:", error)
    res.status(500).json({ message: error.message || "Server error" })
  }
}

const updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can update order status" })
    }

    const { status } = req.body

    const allowedStatuses = [
      "Placed",
      "Preparing",
      "Out for Delivery",
      "Delivered",
    ]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" })
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.status(200).json(updatedOrder)
  } catch (error) {
    console.error("Update order status error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
}