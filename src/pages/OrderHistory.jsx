import { useEffect, useState } from "react"

function OrderHistory() {
  const API_URL = import.meta.env.VITE_API_URL
  const [orders, setOrders] = useState([])
  const [error, setError] = useState("")

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

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "30px 20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Order History</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {orders.map((order) => (
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
                  marginBottom: "14px",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 8px" }}>
                    {order.customerName || "Guest User"}
                  </h3>
                  <p style={{ margin: "0 0 6px", color: "#555" }}>
                    <strong>Phone:</strong> {order.phone}
                  </p>
                  <p style={{ margin: "0 0 6px", color: "#555" }}>
                    <strong>Address:</strong> {order.address}
                  </p>
                  <p style={{ margin: "0 0 6px", color: "#555" }}>
                    <strong>Status:</strong> {order.status}
                  </p>
                </div>

                <div>
                  <p style={{ margin: "0 0 6px", color: "#555" }}>
                    <strong>Total Items:</strong> {order.totalItems}
                  </p>
                  <p style={{ margin: "0 0 6px", color: "#555" }}>
                    <strong>Total Cost:</strong> ${order.totalCost}
                  </p>
                  <p style={{ margin: 0, color: "#555" }}>
                    <strong>Ordered On:</strong>{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
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
                      <h4 style={{ margin: "0 0 6px" }}>{item.name}</h4>
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
          ))}
        </div>
      )}
    </div>
  )
}

export default OrderHistory