const Food = require("../models/Food")

const getFoods = async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 })
    res.status(200).json(foods)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createFood = async (req, res) => {
  try {
    const { name, description, category, price, image, rating, reviews } = req.body

    if (!name || !category || price === undefined) {
      return res
        .status(400)
        .json({ message: "Name, category and price are required" })
    }

    const food = await Food.create({
      name,
      description: description || "",
      category,
      price,
      image: image || "",
      rating: rating || 4.5,
      reviews: reviews || 100,
    })

    res.status(201).json(food)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id)

    if (!food) {
      return res.status(404).json({ message: "Food not found" })
    }

    res.status(200).json({ message: "Food deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getFoods, createFood, deleteFood }