const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const mongoose = require("mongoose")

const authRoutes = require("./routes/authRoutes")
const foodRoutes = require("./routes/foodRoutes")
const orderRoutes = require("./routes/orderRoutes")

dotenv.config()

const app = express()

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)

app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/foods", foodRoutes)
app.use("/api/orders", orderRoutes)

app.get("/", (req, res) => {
  res.send("DineInsight backend is running")
})

const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected")
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message)
  })