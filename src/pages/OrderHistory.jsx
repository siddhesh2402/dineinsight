import { useEffect, useState } from "react"

function OrderHistory() {
  const API_URL = import.meta.env.VITE_API_URL
  const [orders, setOrders] = useState([])
  const [error, setError] = useState("")
  const [updatingId, setUpdatingId] = useState("")

  const fetchOrders = async () => {
    try {
      setError("")
      const res = await fetch(`${API_URL}/api/orders`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch orders")
      }

      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Fetch orders error:", err)
      setError(err.message || "Could not load orders")
      setOrders([])
    }
  }

  useEffect(() => {
    if (API_URL) {
      fetchOrders()
    }
  }, [API_URL])

  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId)
      setError("")

      const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.message || "Failed to update status")
      }

      await fetchOrders()
    } catch (err) {
      console.error("Update order status error:", err)
      setError(err.message || "Could not update status")
    } finally {
      setUpdatingId("")
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Placed":
        return { bg: "#fff7ed", color: "#c2410c" }
      case "Preparing":
        return { bg: "#eff6ff", color: "#1d4ed8" }
      case "Out for Delivery":
        return { bg: "#f5f3ff", color: "#6d28d9" }
      case "Delivered":
        return { bg: "#ecfdf5", color: "#047857" }
      default:
        return { bg: "#f3f4f6", color: "#374151" }
    }
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "30px 20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ margin: 0, color: "#111827" }}>Order History</h1>
        <p style={{ marginTop: "8px", color: "#6b7280" }}>
          View all placed orders and update delivery status.
        </p>
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

      {orders.length === 0 ? (
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          }}
        >
          No orders available.
        </div>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {orders.map((order) => {
            const statusStyle = getStatusColor(order.status)

            return (
              <div
                key={order._id}
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "16px",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "20px",
                    flexWrap: "wrap",
                    marginBottom: "18px",
                  }}
                >
                  <div>
                    <h3 style={{ margin: "0 0 8px", color: "#111827" }}>
                      {order.customerName || "Guest User"}
                    </h3>

                    <p style={{ margin: "0 0 6px", color: "#555" }}>
                      <strong>Phone:</strong> {order.phone}
                    </p>

                    <p style={{ margin: "0 0 6px", color: "#555" }}>
                      <strong>Address:</strong> {order.address}
                    </p>

                    <p style={{ margin: 0, color: "#555" }}>
                      <strong>Ordered On:</strong>{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div style={{ minWidth: "240px" }}>
                    <p style={{ margin: "0 0 6px", color: "#555" }}>
                      <strong>Total Items:</strong> {order.totalItems}
                    </p>

                    <p style={{ margin: "0 0 10px", color: "#555" }}>
                      <strong>Total Cost:</strong> ${order.totalCost}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          background: statusStyle.bg,
                          color: statusStyle.color,
                          padding: "6px 12px",
                          borderRadius: "999px",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >
                        {order.status}
                      </span>

                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                        style={{
                          padding: "10px 12px",
                          borderRadius: "10px",
                          border: "1px solid #d1d5db",
                          background: "white",
                          cursor: "pointer",
                        }}
                      >
                        <option>Placed</option>
                        <option>Preparing</option>
                        <option>Out for Delivery</option>
                        <option>Delivered</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                    gap: "14px",
                  }}
                >
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        border: "1px solid #eee",
                        borderRadius: "12px",
                        padding: "12px",
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />

                      <div>
                        <h4 style={{ margin: "0 0 6px", color: "#111827" }}>
                          {item.name}
                        </h4>

                        <p style={{ margin: "0 0 4px", color: "#555" }}>
                          Qty: {item.qty}
                        </p>

                        <p style={{ margin: 0, color: "#555" }}>
                          ${item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default OrderHistory