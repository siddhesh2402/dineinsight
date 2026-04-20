const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Food = require("./models/Food")

dotenv.config()

const foods = [
  {
    name: "Farmhouse Pizza",
    description: "Loaded with onion, capsicum, mushrooms, and mozzarella cheese.",
    category: "Pizza",
    price: 15,
    image: "https://plus.unsplash.com/premium_photo-1733306588881-0411931d4fed?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.6,
    reviews: 168,
  },
  {
    name: "Pepperoni Pizza",
    description: "Classic pizza topped with pepperoni slices and melted mozzarella cheese.",
    category: "Pizza",
    price: 16,
    image: "https://images.unsplash.com/photo-1589477500339-82aeb8718167?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.7,
    reviews: 154,
  },
  {
    name: "Mexican Green Wave Pizza",
    description: "Crunchy onions, jalapenos, tomatoes, and herbs with cheese.",
    category: "Pizza",
    price: 14,
    image: "https://images.unsplash.com/photo-1651307430359-ea5fe6de3278?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.4,
    reviews: 139,
  },
  {
    name: "Cheese Burst Pizza",
    description: "Extra cheesy pizza with a rich molten cheese center.",
    category: "Pizza",
    price: 17,
    image: "https://images.unsplash.com/photo-1692812472060-c15ca30af036?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
    reviews: 201,
  },

  {
    name: "Farfalle Pesto ",
  description: "Farfalle tossed in a fresh basil pesto sauce with herbs and parmesan.",
  category: "Pasta",
  price: 14,
  image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  rating: 4.6,
  reviews: 152,
  },
  {
    name: "Baked Ziti Pasta",
  description: "Oven-baked pasta layered with tomato sauce, cheese, and Italian herbs.",
  category: "Pasta",
  price: 15,
  image: "https://images.unsplash.com/photo-1522784081430-8ac6a122cbc8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  rating: 4.5,
  reviews: 144,
  },
  {
    name: "Mac and Cheese Pasta",
    description: "Creamy macaroni pasta baked with cheddar and herbs.",
    category: "Pasta",
    price: 14,
    image: "https://images.unsplash.com/photo-1708184528301-b0dad28dded5?q=80&w=1082&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.6,
    reviews: 158,
  },
  {
    name: "Pink Sauce Pasta",
    description: "Delicious pasta in a creamy tomato and cheese blended sauce.",
    category: "Pasta",
    price: 14,
    image: "https://images.unsplash.com/photo-1626028937210-754d2118d5f7?q=80&w=838&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.5,
    reviews: 129,
  },

  {
    name: "Cheese Lava Burger",
    description: "Burger filled with melted cheese, crispy patty, and house sauce.",
    category: "Burger",
    price: 14,
    image: "https://images.unsplash.com/photo-1547584370-2cc98b8b8dc8?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.7,
    reviews: 171,
  },
  {
    name: "Peri Peri Chicken Burger",
    description: "Spicy peri peri chicken burger with lettuce and mayo.",
    category: "Burger",
    price: 15,
    image: "https://images.unsplash.com/photo-1615297928064-24977384d0da?q=80&w=1112&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.6,
    reviews: 149,
  },
  {
    name: "Smoky BBQ Burger",
    description: "Smoky barbecue burger topped with caramelized onions and cheese.",
    category: "Burger",
    price: 14,
    image: "https://images.unsplash.com/photo-1610440042657-612c34d95e9f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.5,
    reviews: 142,
  },
  {
    name: "Paneer Crunch Burger",
    description: "Crispy paneer patty burger with fresh veggies and spicy sauce.",
    category: "Burger",
    price: 13,
    image: "https://images.unsplash.com/photo-1655895176036-bf1a11326e5c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.4,
    reviews: 124,
  },

  {
    name: "Brownie Sundae",
    description: "Warm brownie topped with vanilla ice cream and chocolate syrup.",
    category: "Dessert",
    price: 9,
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
    reviews: 176,
  },
  {
    name: "Red Velvet Pastry",
    description: "Soft red velvet pastry layered with smooth cream frosting.",
    category: "Dessert",
    price: 12,
    image: "https://images.unsplash.com/photo-1714949134591-d6f2c581b20d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.5,
    reviews: 132,
  },
  {
    name: "Lotus Biscoff Cheesecake",
    description: "Creamy cheesecake topped with lotus biscuit crumbs and spread.",
    category: "Dessert",
    price: 10,
    image: "https://images.unsplash.com/photo-1708980108345-171931ad1fa8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.7,
    reviews: 165,
  },
  {
    name: "Choco Lava Cake",
    description: "Warm chocolate cake with a rich molten chocolate center.",
    category: "Dessert",
    price: 9,
    image: "https://images.unsplash.com/photo-1617305855058-336d24456869?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
    reviews: 188,
  },

  {
    name: "Chicken Biryani",
    description: "Aromatic basmati rice cooked with spiced chicken and herbs.",
    category: "Main",
    price: 17,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
    reviews: 214,
  },
  {
    name: "Paneer Biryani",
    description: "Flavorful rice dish cooked with vegetables and traditional spices.",
    category: "Main",
    price: 14,
    image: "https://images.unsplash.com/photo-1691171047462-66025ecd5efc?q=80&w=711&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.4,
    reviews: 136,
  },
  {
    name: "Paneer Rice Bowl",
    description: "Rice bowl served with paneer, vegetables, and savory sauce.",
    category: "Main",
    price: 15,
    image: "https://images.unsplash.com/photo-1771074168434-95cb12896146?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.5,
    reviews: 121,
  },
  {
    name: "Schezwan Noodles",
    description: "Spicy stir-fried noodles tossed with vegetables and schezwan sauce.",
    category: "Main",
    price: 13,
    image: "https://images.unsplash.com/photo-1617622141675-d3005b9067c5?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.3,
    reviews: 117,
  },
{
    name: "Chicken triple Schezwan fried rice",
    description: "Flavorful chicken triple schezwan fried rice tossed with vegetables, noodles, and spicy schezwan sauce.",
    category: "Main",
    price: 16,
    image: "https://images.unsplash.com/photo-1672856399675-8c099efbe0e2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.7,
    reviews: 117,
  },


]
const seedFoods = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    const existingFoods = await Food.find({}, { name: 1 })
    const existingNames = new Set(
      existingFoods.map((food) => food.name.trim().toLowerCase())
    )

    const newFoods = foods.filter(
      (food) => !existingNames.has(food.name.trim().toLowerCase())
    )

    if (newFoods.length === 0) {
      console.log("No new foods to insert. All dishes already exist.")
      process.exit(0)
    }

    const insertedFoods = await Food.insertMany(newFoods)

    console.log(`${insertedFoods.length} new dishes inserted successfully`)
    console.log("Inserted dishes:", insertedFoods.map((food) => food.name))

    process.exit(0)
  } catch (error) {
    console.error("Seed error:", error)
    process.exit(1)
  }
}

seedFoods()