const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      default: "Guest User",
    },
    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    items: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          default: "",
        },
      },
    ],
    totalItems: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Placed", "Preparing", "Out for Delivery", "Delivered"],
      default: "Placed",
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Order", orderSchema)