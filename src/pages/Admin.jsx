import { useEffect, useState } from "react"
import hero from "../assets/hero-food.jpg"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts"

function Admin({ foods = [], setFoods }) {
  const API_URL = import.meta.env.VITE_API_URL
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  const role = localStorage.getItem("role")

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Pizza",
    price: "",
    image: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [allOrders, setAllOrders] = useState([])

  const imagePreview =
    form.image && form.image.trim() !== "" ? form.image : hero

  const fetchFoods = async () => {
    try {
      setError("")
      const res = await fetch(`${API_URL}/api/foods`)
      const data = await res.json().catch(() => [])

      if (!res.ok) {
        throw new Error(data.message || `Failed to fetch foods: ${res.status}`)
      }

      setFoods(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Fetch foods error:", err)
      setError(err.message || "Could not load foods")
      setFoods([])
    }
  }

  const fetchOrders = async () => {
    try {
      setError("")

      const token = localStorage.getItem("token")

      const res = await fetch(`${API_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json().catch(() => [])

      if (!res.ok) {
        throw new Error(data.message || `Failed to fetch orders: ${res.status}`)
      }

      setAllOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Fetch orders error:", err)
      setError(err.message || "Could not load orders")
      setAllOrders([])
    }
  }

  useEffect(() => {
    if (API_URL) {
      fetchOrders()
    }
  }, [API_URL])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      category: "Pizza",
      price: "",
      image: "",
    })
    setEditingId(null)
    setError("")
  }

  const openUploadWidget = () => {
    if (!window.cloudinary) {
      setError("Cloudinary widget not loaded")
      return
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        multiple: false,
        cropping: false,
        folder: "dineinsight",
        sources: ["local", "camera", "url"],
        resourceType: "image",
      },
      (err, result) => {
        if (err) {
          console.error("Cloudinary error:", err)
          setError("Image upload failed")
          return
        }

        if (result && result.event === "success") {
          setForm((prev) => ({
            ...prev,
            image: result.info.secure_url,
          }))
          setError("")
        }
      }
    )

    widget.open()
  }

  const addOrUpdateFood = async () => {
    if (!form.name.trim() || !form.category.trim() || !form.price) {
      setError("Name, category and price are required")
      return
    }

    if (!form.image.trim()) {
      setError("Please upload an image")
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

      const url = editingId
        ? `${API_URL}/api/foods/${editingId}`
        : `${API_URL}/api/foods`

      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.message || `Failed: ${res.status}`)
      }

      resetForm()
      await fetchFoods()
    } catch (err) {
      console.error("Save food error:", err)
      setError(err.message || "Could not save dish")
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

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.message || `Failed: ${res.status}`)
      }

      await fetchFoods()
    } catch (err) {
      console.error("Delete food error:", err)
      setError(err.message || "Could not delete dish")
    }
  }

  const startEdit = (food) => {
    setForm({
      name: food.name || "",
      description: food.description || "",
      category: food.category || "Pizza",
      price: food.price || "",
      image: food.image || "",
    })
    setEditingId(food._id)
    setError("")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const totalOrders = allOrders.length
  const totalRevenue = allOrders.reduce(
    (sum, order) => sum + (order.totalCost || 0),
    0
  )

  const categoryCount = {}
  foods.forEach((food) => {
    categoryCount[food.category] = (categoryCount[food.category] || 0) + 1
  })

  const pieData = Object.keys(categoryCount).map((cat) => ({
    name: cat,
    value: categoryCount[cat],
  }))

  const dishesBarData = Object.keys(categoryCount).map((cat) => ({
    category: cat,
    dishes: categoryCount[cat],
  }))

  const statusCount = {}
  allOrders.forEach((order) => {
    statusCount[order.status] = (statusCount[order.status] || 0) + 1
  })

  const statusBarData = Object.keys(statusCount).map((status) => ({
    status,
    count: statusCount[status],
  }))

  const revenueByDate = {}
  allOrders.forEach((order) => {
    const dateKey = new Date(order.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    revenueByDate[dateKey] =
      (revenueByDate[dateKey] || 0) + (order.totalCost || 0)
  })

  const salesLineData = Object.keys(revenueByDate).map((date) => ({
    date,
    revenue: revenueByDate[date],
  }))

  const itemOrderCount = {}
  allOrders.forEach((order) => {
    ;(order.items || []).forEach((item) => {
      itemOrderCount[item.name] = (itemOrderCount[item.name] || 0) + (item.qty || 0)
    })
  })

  const mostOrderedItemsData = Object.keys(itemOrderCount)
    .map((name) => ({
      name,
      qty: itemOrderCount[name],
    }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 7)

  const topOrderedItem =
    mostOrderedItemsData.length > 0 ? mostOrderedItemsData[0].name : "None"

  const COLORS = ["#1B4332", "#1976d2", "#f59e0b", "#d62828", "#7c3aed", "#06b6d4"]

  const cardStyle = {
    background: "rgba(255,255,255,0.98)",
    padding: "22px",
    borderRadius: "22px",
    boxShadow: "0 14px 34px rgba(0,0,0,0.07)",
    border: "1px solid #eef2f7",
  }

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d9d9d9",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
  }

  const primaryButton = {
    background: "#1B4332",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  }

  const secondaryButton = {
    background: "#1976d2",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  }

  const neutralButton = {
    background: "#8d99ae",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  }

  const dangerButton = {
    background: "#d62828",
    color: "white",
    border: "none",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  }

  if (role !== "admin") {
    return (
      <div
        style={{
          maxWidth: "900px",
          margin: "40px auto",
          padding: "30px 20px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginTop: 0, color: "#111827" }}>Access Denied</h2>
          <p style={{ color: "#6b7280", marginBottom: 0 }}>
            Only admin users can access this page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "clamp(20px, 4vw, 36px) clamp(14px, 3vw, 24px) 56px",
      }}
    >
      <div
        style={{
          marginBottom: "28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "40px",
              fontWeight: "800",
              color: "#111827",
              letterSpacing: "-0.5px",
            }}
          >
            Admin Dashboard
          </h1>
          <p
            style={{
              marginTop: "10px",
              color: "#6b7280",
              fontSize: "15px",
              lineHeight: "1.6",
            }}
          >
            Manage dishes, track real-time orders, revenue, and menu analytics.
          </p>
        </div>

        <button
          onClick={() => {
            fetchFoods()
            fetchOrders()
          }}
          style={{
            background: "linear-gradient(135deg, #1B4332 0%, #2d6a4f 100%)",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "999px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "14px",
            boxShadow: "0 10px 22px rgba(27,67,50,0.20)",
          }}
        >
          Refresh Dashboard
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: "18px",
          marginBottom: "30px",
        }}
      >
        <div style={cardStyle}>
          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: "13px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
            }}
          >
            Menu Items
          </p>
          <h2
            style={{
              margin: "12px 0 0",
              color: "#111827",
              fontSize: "34px",
              fontWeight: "800",
            }}
          >
            {foods.length}
          </h2>
        </div>

        <div style={cardStyle}>
          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: "13px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
            }}
          >
            Total Orders
          </p>
          <h2
            style={{
              margin: "12px 0 0",
              color: "#111827",
              fontSize: "34px",
              fontWeight: "800",
            }}
          >
            {totalOrders}
          </h2>
        </div>

        <div style={cardStyle}>
          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: "13px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
            }}
          >
            Revenue
          </p>
          <h2
            style={{
              margin: "12px 0 0",
              color: "#111827",
              fontSize: "34px",
              fontWeight: "800",
            }}
          >
            ${totalRevenue}
          </h2>
        </div>

        <div style={cardStyle}>
          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: "13px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
            }}
          >
            Top Ordered Item
          </p>
          <h2
            style={{
              margin: "12px 0 0",
              color: "#111827",
              fontSize: "24px",
              fontWeight: "800",
              lineHeight: "1.3",
            }}
          >
            {topOrderedItem}
          </h2>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(360px,1fr))",
          gap: "18px",
          marginBottom: "32px",
        }}
      >
        <div style={cardStyle}>
          <h3
            style={{
              margin: "0 0 14px",
              color: "#111827",
              fontSize: "22px",
              fontWeight: "800",
            }}
          >
            Menu Categories
          </h3>
          <div style={{ width: "100%", height: "280px" }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={cardStyle}>
          <h3
            style={{
              margin: "0 0 14px",
              color: "#111827",
              fontSize: "22px",
              fontWeight: "800",
            }}
          >
            Dishes by Category
          </h3>
          <div style={{ width: "100%", height: "280px" }}>
            <ResponsiveContainer>
              <BarChart data={dishesBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="dishes" fill="#1976d2" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={cardStyle}>
          <h3
            style={{
              margin: "0 0 14px",
              color: "#111827",
              fontSize: "22px",
              fontWeight: "800",
            }}
          >
            Orders by Status
          </h3>
          <div style={{ width: "100%", height: "280px" }}>
            <ResponsiveContainer>
              <BarChart data={statusBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#1B4332" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={cardStyle}>
          <h3
            style={{
              margin: "0 0 14px",
              color: "#111827",
              fontSize: "22px",
              fontWeight: "800",
            }}
          >
            Sales Chart
          </h3>
          <div style={{ width: "100%", height: "280px" }}>
            <ResponsiveContainer>
              <LineChart data={salesLineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f59e0b"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ ...cardStyle, gridColumn: "1 / -1" }}>
          <h3
            style={{
              margin: "0 0 14px",
              color: "#111827",
              fontSize: "22px",
              fontWeight: "800",
            }}
          >
            Most Ordered Items
          </h3>
          <div style={{ width: "100%", height: "320px" }}>
            <ResponsiveContainer>
              <BarChart data={mostOrderedItemsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="qty" fill="#d62828" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ ...cardStyle, marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "18px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "#111827",
                fontSize: "28px",
                fontWeight: "800",
              }}
            >
              {editingId ? "Edit Dish" : "Add New Dish"}
            </h2>
            <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: "14px" }}>
              Fill in the details and keep your menu updated in real time.
            </p>
          </div>
        </div>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "12px 14px",
              borderRadius: "10px",
              marginBottom: "16px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "14px",
            marginBottom: "14px",
          }}
        >
          <input
            name="name"
            placeholder="Dish name"
            value={form.name}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: editingId
              ? "repeat(auto-fit,minmax(180px,1fr))"
              : "repeat(auto-fit,minmax(180px,1fr))",
            gap: "14px",
            alignItems: "stretch",
            marginBottom: "20px",
          }}
        >
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            style={inputStyle}
          >
            <option>Pizza</option>
            <option>Burger</option>
            <option>Pasta</option>
            <option>Dessert</option>
            <option>Main</option>
          </select>

          <button onClick={openUploadWidget} type="button" style={secondaryButton}>
            Upload Image
          </button>

          <button
            onClick={addOrUpdateFood}
            disabled={loading}
            style={{
              ...primaryButton,
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? "Saving..." : editingId ? "Update Dish" : "Add Dish"}
          </button>

          {editingId && (
            <button onClick={resetForm} type="button" style={neutralButton}>
              Cancel
            </button>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: "20px",
            alignItems: "start",
          }}
        >
          <div>
            <p style={{ margin: "0 0 10px", fontWeight: "600", color: "#111827" }}>
              Image Preview
            </p>
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: "100%",
                height: "210px",
                objectFit: "cover",
                borderRadius: "14px",
                border: "1px solid #e5e7eb",
              }}
            />
          </div>

          <div
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "18px",
            }}
          >
            <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
              Current form summary
            </p>
            <h3 style={{ margin: "8px 0 10px", color: "#111827" }}>
              {form.name || "Dish name"}
            </h3>
            <p style={{ margin: "0 0 8px", color: "#4b5563" }}>
              {form.description || "Dish description will appear here."}
            </p>
            <p style={{ margin: "0 0 6px", color: "#374151" }}>
              <strong>Category:</strong> {form.category}
            </p>
            <p style={{ margin: 0, color: "#374151" }}>
              <strong>Price:</strong> {form.price ? `$${form.price}` : "$0"}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2
          style={{
            marginBottom: "18px",
            color: "#111827",
            fontSize: "30px",
            fontWeight: "800",
          }}
        >
          All Dishes
        </h2>

        {foods.length === 0 ? (
          <div style={cardStyle}>
            <p style={{ margin: 0, color: "#6b7280" }}>No dishes available.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))",
              gap: "18px",
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
                    borderRadius: "18px",
                    overflow: "hidden",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    border: "1px solid #f0f0f0",
                  }}
                >
                  <img
                    src={imgSrc}
                    alt={food.name}
                    style={{
                      width: "100%",
                      height: "190px",
                      objectFit: "cover",
                    }}
                  />

                  <div style={{ padding: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "10px",
                        alignItems: "start",
                      }}
                    >
                      <h3 style={{ margin: 0, color: "#111827", fontSize: "20px" }}>
                        {food.name}
                      </h3>
                      <span
                        style={{
                          background: "#ecfdf5",
                          color: "#065f46",
                          padding: "6px 10px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: "600",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {food.category}
                      </span>
                    </div>

                    <p
                      style={{
                        margin: "10px 0 12px",
                        color: "#6b7280",
                        minHeight: "40px",
                        fontSize: "14px",
                      }}
                    >
                      {food.description || "No description"}
                    </p>

                    <p
                      style={{
                        margin: "0 0 14px",
                        color: "#111827",
                        fontWeight: "700",
                        fontSize: "18px",
                      }}
                    >
                      ${food.price}
                    </p>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => startEdit(food)}
                        style={{
                          ...primaryButton,
                          flex: 1,
                          padding: "10px 12px",
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteFood(food._id)}
                        style={{
                          ...dangerButton,
                          flex: 1,
                        }}
                      >
                        Delete
                      </button>
                    </div>
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