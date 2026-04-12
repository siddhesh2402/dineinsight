const mongoose = require("mongoose")

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    reviews: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Food", foodSchema)