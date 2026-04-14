import { useEffect, useState } from "react"
import hero from "../assets/hero-food.jpg"

function Admin({ foods = [], setFoods, orders = [] }) {
  const API_URL = import.meta.env.VITE_API_URL
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

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

  const imagePreview =
    form.image && form.image.trim() !== "" ? form.image : hero

  const fetchFoods = async () => {
    try {
      setError("")
      const res = await fetch(`${API_URL}/api/foods`)

      const data = await res.json()
      setFoods(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Fetch foods error:", err)
      setError("Could not load foods")
      setFoods([])
    }
  }

  useEffect(() => {
    if (API_URL) fetchFoods()
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
  }

  /* CLOUDINARY UPLOAD */
  const openUploadWidget = () => {
    if (!window.cloudinary) {
      setError("Cloudinary not loaded")
      return
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        multiple: false,
        sources: ["local", "camera", "url"],
        folder: "dineinsight",
      },
      (err, result) => {
        if (err) {
          console.error(err)
          setError("Upload failed")
          return
        }

        if (result.event === "success") {
          setForm((prev) => ({
            ...prev,
            image: result.info.secure_url,
          }))
        }
      }
    )

    widget.open()
  }

  /* FIXED FUNCTION */
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
      const res = await fetch(`${API_URL}/api/foods/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Delete failed")

      await fetchFoods()
    } catch (err) {
      console.error(err)
      setError("Could not delete dish")
    }
  }

  const startEdit = (food) => {
    setForm({
      name: food.name,
      description: food.description,
      category: food.category,
      price: food.price,
      image: food.image,
    })
    setEditingId(food._id)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Admin Panel</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "20px" }}>
        <input
          name="name"
          placeholder="Dish name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />

        <select name="category" value={form.category} onChange={handleChange}>
          <option>Pizza</option>
          <option>Burger</option>
          <option>Pasta</option>
          <option>Dessert</option>
          <option>Main</option>
        </select>

        <button onClick={openUploadWidget}>Upload Image</button>

        <button onClick={addOrUpdateFood}>
          {editingId ? "Update Dish" : "Add Dish"}
        </button>

        {editingId && <button onClick={resetForm}>Cancel</button>}
      </div>

      <img
        src={imagePreview}
        style={{ width: "200px", borderRadius: "10px" }}
      />

      <h2>All Dishes</h2>

      {foods.map((food) => (
        <div key={food._id}>
          <h3>{food.name}</h3>
          <img src={food.image || hero} width="200" />
          <p>${food.price}</p>

          <button onClick={() => startEdit(food)}>Edit</button>
          <button onClick={() => deleteFood(food._id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}

export default Admin