import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import FoodCard from "./components/FoodCard"
import { Routes, Route } from "react-router-dom"
import Cart from "./pages/Cart"
import Admin from "./pages/Admin"
import hero from "./assets/hero-food.jpg"
import LoginPopup from "./components/LoginPopup"
import OrderHistory from "./pages/OrderHistory"


function App() {
  const API_URL = import.meta.env.VITE_API_URL

  const [foods, setFoods] = useState([])
  const [category, setCategory] = useState("All")
  const [search, setSearch] = useState("")
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([])
  const [showLogin, setShowLogin] = useState(false)

  const userEmail = localStorage.getItem("userEmail")

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await fetch(`${API_URL}/api/foods`)

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`)
        }

        const data = await res.json()
        setFoods(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Error fetching foods:", err)
        setFoods([])
      }
    }

    if (API_URL) {
      fetchFoods()
    }
  }, [API_URL])

  useEffect(() => {
    if (userEmail) {
      const savedCart =
        JSON.parse(localStorage.getItem("cart_" + userEmail)) || []
      setCart(savedCart)
    } else {
      setCart([])
    }
  }, [userEmail])

  const saveCart = (updatedCart) => {
    setCart(updatedCart)

    if (userEmail) {
      localStorage.setItem("cart_" + userEmail, JSON.stringify(updatedCart))
    }
  }

  const addToCart = (food) => {
    const existingItem = cart.find((item) => item._id === food._id)

    let updatedCart

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item._id === food._id ? { ...item, qty: item.qty + 1 } : item
      )
    } else {
      updatedCart = [...cart, { ...food, qty: 1 }]
    }

    saveCart(updatedCart)
  }

  const removeFromCart = (foodId) => {
    const updatedCart = cart
      .map((item) =>
        item._id === foodId ? { ...item, qty: item.qty - 1 } : item
      )
      .filter((item) => item.qty > 0)

    saveCart(updatedCart)
  }

  const checkout = async (orderDetails) => {
  if (cart.length === 0) return

  try {
    const payload = {
      customerName: orderDetails.customerName || "Guest User",
      email: userEmail || "",
      phone: orderDetails.phone,
      address: orderDetails.address,
      items: cart,
    }

    const res = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data.message || "Failed to place order")
    }

    setOrders((prev) => [...prev, data])
    setCart([])

    if (userEmail) {
      localStorage.setItem("cart_" + userEmail, JSON.stringify([]))
    }

    alert("Order placed successfully!")
  } catch (err) {
    console.error("Checkout error:", err)
    alert(err.message || "Could not place order")
  }
}

  const filteredFoods = foods.filter((food) => {
    const categoryMatch = category === "All" || food.category === category
    const searchMatch = food.name
      .toLowerCase()
      .includes(search.toLowerCase())

    return categoryMatch && searchMatch
  })

  return (
    <div
      style={{
        background: "#f5f5f5",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Navbar
        cartCount={cart.reduce((total, item) => total + item.qty, 0)}
        setShowLogin={setShowLogin}
      />

      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      <Routes>
        <Route
          path="/"
          element={
            <div>
              <div
                style={{
                  maxWidth: "1200px",
                  margin: "40px auto 24px",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
              >
                <img
                  src={hero}
                  alt="Hero"
                  style={{
                    width: "100%",
                    height: "320px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>

              <div style={{ textAlign: "center", padding: "0 20px" }}>
                <h2
                  style={{
                    marginBottom: "8px",
                    fontSize: "32px",
                    color: "#111827",
                  }}
                >
                  Explore Our Menu
                </h2>

                <p style={{ color: "#6b7280", marginTop: 0 }}>
                  Choose from a variety of delicious dishes
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                  padding: "0 20px",
                }}
              >
                <input
                  type="text"
                  placeholder="Search pizza, burger, pasta..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    maxWidth: "420px",
                    padding: "14px 18px",
                    borderRadius: "999px",
                    border: "1px solid #ddd",
                    outline: "none",
                    fontSize: "14px",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "12px",
                  margin: "28px 0",
                  flexWrap: "wrap",
                  padding: "0 20px",
                }}
              >
                {["All", "Pizza", "Burger", "Pasta", "Dessert", "Main"].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      style={{
                        background: category === cat ? "#1B4332" : "white",
                        color: category === cat ? "white" : "#333",
                        border: "1px solid #ddd",
                        padding: "10px 18px",
                        borderRadius: "999px",
                        cursor: "pointer",
                        fontWeight: "600",
                        boxShadow:
                          category === cat
                            ? "0 6px 16px rgba(27,67,50,0.25)"
                            : "0 4px 12px rgba(0,0,0,0.04)",
                      }}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>

              <div
                style={{
                  maxWidth: "1200px",
                  margin: "0 auto",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
                  gap: "24px",
                  padding: "0 20px 40px",
                }}
              >
                {filteredFoods.length === 0 ? (
  <p style={{ color: "#6b7280" }}>No dishes available.</p>
) : (
  {filteredFoods.length === 0 ? (
  <p style={{ color: "#6b7280" }}>No dishes available.</p>
) : (
  filteredFoods.map((food) => (
    <FoodCard
      key={food._id}
      food={food}
      cart={cart}
      addToCart={addToCart}
      removeFromCart={removeFromCart}
                  />
                ))}
              </div>
            </div>
          }
        />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              checkout={checkout}
            />
          }
        />

<Route
path="/orders"
element={<OrderHistory />}
/>


        <Route
          path="/admin"
          element={
            <Admin
              foods={foods}
              setFoods={setFoods}
              orders={orders}
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App