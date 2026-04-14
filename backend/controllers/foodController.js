const Food = require("../models/Food")

const getFoods = async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 })
    res.status(200).json(foods)
  } catch (error) {
    console.error("Get foods error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const createFood = async (req, res) => {
  try {
    const { name, description, category, price, image } = req.body

    if (!name || !category || price === undefined) {
      return res.status(400).json({
        message: "Name, category and price are required",
      })
    }

    const newFood = new Food({
      name: name.trim(),
      description: description || "",
      category,
      price: Number(price),
      image: image || "",
      rating: 4.5,
      reviews: 100,
    })

    const savedFood = await newFood.save()
    res.status(201).json(savedFood)
  } catch (error) {
    console.error("Create food error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const updateFood = async (req, res) => {
  try {
    const { name, description, category, price, image } = req.body

    if (!name || !category || price === undefined) {
      return res.status(400).json({
        message: "Name, category and price are required",
      })
    }

    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        description: description || "",
        category,
        price: Number(price),
        image: image || "",
      },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!updatedFood) {
      return res.status(404).json({ message: "Food not found" })
    }

    res.status(200).json(updatedFood)
  } catch (error) {
    console.error("Update food error:", error)
    res.status(500).json({ message: error.message || "Server error" })
  }
}

const deleteFood = async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id)

    if (!deletedFood) {
      return res.status(404).json({ message: "Food not found" })
    }

    res.status(200).json({ message: "Food deleted successfully" })
  } catch (error) {
    console.error("Delete food error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = {
  getFoods,
  createFood,
  updateFood,
  deleteFood,
}