const express = require("express")
const {
  getFoods,
  createFood,
  deleteFood,
} = require("../controllers/foodController")

const router = express.Router()

router.get("/", getFoods)
router.post("/", createFood)
router.delete("/:id", deleteFood)

module.exports = router