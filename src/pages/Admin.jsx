import { useEffect, useState } from "react"
import hero from "../assets/hero-food.jpg"

function Admin({ foods = [], setFoods, orders = [] }) {
  const API_URL = import.meta.env.VITE_API_URL

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Pizza",
    price: "",
    image: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const imagePreview =
    form.image && form.image.trim() !== "" ? form.image : hero

  const fetchFoods = async () => {
    try {
      setError("")

      const res = await fetch(`${API_URL}/api/foods`)

      if (!res.ok) {
        throw new Error(`Failed to fetch foods: ${res.status}`)
      }

      const data = await res.json()
      setFoods(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Fetch foods error:", err)
      setError("Could not load foods")
      setFoods([])
    }
  }

  useEffect(() => {
    if (API_URL) {
      fetchFoods()
    }
  }, [API_URL])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addFood = async () => {
    if (!form.name.trim() || !form.category.trim() || !form.price) {
      setError("Name, category and price are required")
      return
    }

    try {
      setLoading(true)
      setError("")

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        price: Number(form.price),
        image: form.image.trim(),
      }

      const res = await fetch(`${API_URL}/api/foods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error(`Failed to add food: ${res.status}`)
      }

      setForm({
        name: "",
        description: "",
        category: "Pizza",
        price: "",
        image: "",
      })

      await fetchFoods()
    } catch (err) {
      console.error("Add food error:", err)
      setError("Could not add dish")
    } finally {
      setLoading(false)
    }
  }

  const deleteFood = async (id) => {
    try {
      setError("")

      const res = await fetch(`${API_URL}/api/foods/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error(`Failed to delete food: ${res.status}`)
      }

      await fetchFoods()
    } catch (err) {
      console.error("Delete food error:", err)
      setError("Could not delete dish")
    }
  }

  const totalOrders = orders.length
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.total || 0),
    0
  )

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px" }}>Admin Panel - Manage Dishes</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ margin: 0 }}>Menu Items</h3>
          <p style={{ fontSize: "24px", margin: "10px 0 0" }}>{foods.length}</p>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ margin: 0 }}>Total Orders</h3>
          <p style={{ fontSize: "24px", margin: "10px 0 0" }}>{totalOrders}</p>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ margin: 0 }}>Revenue</h3>
          <p style={{ fontSize: "24px", margin: "10px 0 0" }}>${totalRevenue}</p>
        </div>
      </div>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Add New Dish</h2>

        {error && (
          <p style={{ color: "red", marginBottom: "15px" }}>
            {error}
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "15px",
            alignItems: "start",
          }}
        >
          <input
            name="name"
            placeholder="Dish name"
            value={form.name}
            onChange={handleChange}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <input
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          >
            <option>Pizza</option>
            <option>Burger</option>
            <option>Pasta</option>
            <option>Dessert</option>
            <option>Main</option>
          </select>

          <button
            onClick={addFood}
            disabled={loading}
            style={{
              background: "#1B4332",
              color: "white",
              border: "none",
              padding: "12px 18px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {loading ? "Adding..." : "Add Dish"}
          </button>
        </div>

        <div style={{ marginTop: "20px", maxWidth: "320px" }}>
          <p style={{ marginBottom: "8px", fontWeight: "bold" }}>Image Preview</p>
          <img
            src={imagePreview}
            alt="Preview"
            style={{
              width: "100%",
              height: "180px",
              objectFit: "cover",
              borderRadius: "10px",
              border: "1px solid #ddd",
            }}
          />
        </div>
      </div>

      <div>
        <h2>All Dishes</h2>

        {foods.length === 0 ? (
          <p>No dishes available</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: "20px",
            }}
          >
            {foods.map((food) => {
              const imgSrc =
                food.image && food.image.trim() !== "" ? food.image : hero

              return (
                <div
                  key={food._id}
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  <img
                    src={imgSrc}
                    alt={food.name}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                    }}
                  />

                  <div style={{ padding: "15px" }}>
                    <h3 style={{ marginTop: 0, marginBottom: "8px" }}>
                      {food.name}
                    </h3>

                    <p style={{ margin: "0 0 8px", color: "#555" }}>
                      {food.description || "No description"}
                    </p>

                    <p style={{ margin: "0 0 6px" }}>
                      <strong>Category:</strong> {food.category}
                    </p>

                    <p style={{ margin: "0 0 12px" }}>
                      <strong>Price:</strong> ${food.price}
                    </p>

                    <button
                      onClick={() => deleteFood(food._id)}
                      style={{
                        background: "#d62828",
                        color: "white",
                        border: "none",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin