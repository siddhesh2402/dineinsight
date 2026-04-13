const express = require("express")
const router = express.Router()

const {
  getFoods,
  createFood,
  updateFood,
  deleteFood,
} = require("../controllers/foodController")

router.get("/", getFoods)
router.post("/", createFood)
router.put("/:id", updateFood)
router.delete("/:id", deleteFood)

module.exports = router