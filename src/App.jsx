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
    const searchMatch = (food.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())

    return categoryMatch && searchMatch
  })

  const categories = ["All", "Pizza", "Burger", "Pasta", "Dessert", "Main"]

  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, #f8fafc 0%, #f3f4f6 35%, #f9fafb 100%)",
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
                  maxWidth: "1260px",
                  margin: "32px auto 0",
                  padding: "0 20px",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    borderRadius: "28px",
                    overflow: "hidden",
                    boxShadow: "0 18px 45px rgba(0,0,0,0.10)",
                    background: "white",
                  }}
                >
                  <img
                    src={hero}
                    alt="Hero"
                    style={{
                      width: "100%",
                      height: "380px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.05) 100%)",
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      left: "40px",
                      bottom: "38px",
                      color: "white",
                      maxWidth: "520px",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        background: "rgba(255,255,255,0.18)",
                        backdropFilter: "blur(8px)",
                        padding: "8px 14px",
                        borderRadius: "999px",
                        fontSize: "13px",
                        fontWeight: "700",
                        marginBottom: "16px",
                      }}
                    >
                      Fresh food. Fast delivery. Better experience.
                    </div>

                    <h1
                      style={{
                        margin: "0 0 12px",
                        fontSize: "42px",
                        lineHeight: "1.1",
                        fontWeight: "800",
                      }}
                    >
                      Discover your next favorite meal
                    </h1>

                    <p
                      style={{
                        margin: 0,
                        fontSize: "16px",
                        lineHeight: "1.6",
                        color: "rgba(255,255,255,0.92)",
                      }}
                    >
                      Explore premium dishes, add items instantly, and manage your
                      cart with a smoother restaurant ordering experience.
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  maxWidth: "1260px",
                  margin: "28px auto 0",
                  padding: "0 20px",
                }}
              >
                <div
                  style={{
                    background: "rgba(255,255,255,0.75)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.8)",
                    borderRadius: "24px",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
                    padding: "28px 24px",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <h2
                      style={{
                        margin: "0 0 8px",
                        fontSize: "30px",
                        color: "#111827",
                        fontWeight: "800",
                      }}
                    >
                      Explore Our Menu
                    </h2>

                    <p
                      style={{
                        margin: 0,
                        color: "#6b7280",
                        fontSize: "15px",
                      }}
                    >
                      Search, filter, and add dishes instantly from the home page.
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "22px",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Search pizza, burger, pasta..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{
                        width: "100%",
                        maxWidth: "460px",
                        padding: "15px 20px",
                        borderRadius: "999px",
                        border: "1px solid #e5e7eb",
                        outline: "none",
                        fontSize: "14px",
                        background: "white",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "12px",
                      marginTop: "22px",
                      flexWrap: "wrap",
                    }}
                  >
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        style={{
                          background: category === cat ? "#1B4332" : "white",
                          color: category === cat ? "white" : "#374151",
                          border:
                            category === cat
                              ? "1px solid #1B4332"
                              : "1px solid #e5e7eb",
                          padding: "11px 18px",
                          borderRadius: "999px",
                          cursor: "pointer",
                          fontWeight: "700",
                          fontSize: "14px",
                          boxShadow:
                            category === cat
                              ? "0 10px 22px rgba(27,67,50,0.20)"
                              : "0 6px 16px rgba(0,0,0,0.04)",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div
                style={{
                  maxWidth: "1260px",
                  margin: "28px auto 0",
                  padding: "0 20px 48px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    marginBottom: "18px",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: "0 0 6px",
                        color: "#111827",
                        fontSize: "24px",
                        fontWeight: "800",
                      }}
                    >
                      Featured Dishes
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        color: "#6b7280",
                        fontSize: "14px",
                      }}
                    >
                      {filteredFoods.length} item
                      {filteredFoods.length === 1 ? "" : "s"} found
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
                    gap: "26px",
                    alignItems: "stretch",
                  }}
                >
                  {filteredFoods.length === 0 ? (
                    <div
                      style={{
                        gridColumn: "1 / -1",
                        background: "white",
                        borderRadius: "20px",
                        padding: "34px 20px",
                        textAlign: "center",
                        color: "#6b7280",
                        boxShadow: "0 10px 24px rgba(0,0,0,0.05)",
                        border: "1px solid #eef2f7",
                      }}
                    >
                      No dishes available
                    </div>
                  ) : (
                    filteredFoods.map((food) => (
                      <FoodCard
                        key={food._id}
                        food={food}
                        cart={cart}
                        addToCart={addToCart}
                        removeFromCart={removeFromCart}
                      />
                    ))
                  )}
                </div>
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

        <Route path="/orders" element={<OrderHistory />} />

        <Route
          path="/admin"
          element={
            <Admin
              foods={foods}
              setFoods={setFoods}
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App