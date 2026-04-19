import { useEffect, useState } from "react"
import hero from "../assets/hero-food.jpg"

function OrderHistory() {
  const API_URL = import.meta.env.VITE_API_URL
  const role = localStorage.getItem("role")
  const userEmail = localStorage.getItem("userEmail")

  const [orders, setOrders] = useState([])
  const [error, setError] = useState("")
  const [updatingId, setUpdatingId] = useState("")

  const fetchOrders = async () => {
    try {
      setError("")

      const endpoint =
        role === "admin"
          ? `${API_URL}/api/orders`
          : `${API_URL}/api/orders?email=${encodeURIComponent(userEmail || "")}`

      const res = await fetch(endpoint)
      const data = await res.json().catch(() => [])

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
        throw new Error(data.message || "Failed to update order status")
      }

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      )
    } catch (err) {
      console.error("Update status error:", err)
      setError(err.message || "Could not update order status")
    } finally {
      setUpdatingId("")
    }
  }

  const getStatusStyles = (status) => {
    switch (status) {
      case "Placed":
        return {
          background: "#fff7ed",
          color: "#c2410c",
          border: "1px solid #fdba74",
        }
      case "Preparing":
        return {
          background: "#eff6ff",
          color: "#1d4ed8",
          border: "1px solid #93c5fd",
        }
      case "Out for Delivery":
        return {
          background: "#f5f3ff",
          color: "#6d28d9",
          border: "1px solid #c4b5fd",
        }
      case "Delivered":
        return {
          background: "#ecfdf5",
          color: "#047857",
          border: "1px solid #86efac",
        }
      default:
        return {
          background: "#f3f4f6",
          color: "#374151",
          border: "1px solid #d1d5db",
        }
    }
  }

  const steps = ["Placed", "Preparing", "Out for Delivery", "Delivered"]

  const getStepIndex = (status) => {
    const index = steps.indexOf(status)
    return index === -1 ? 0 : index
  }

  const pageTitle = role === "admin" ? "Order Management" : "My Orders"
  const pageSubtitle =
    role === "admin"
      ? "View all orders, customer details, ordered items, and update delivery status."
      : "Track your orders and view the latest delivery status updates."

  if (role !== "admin" && !userEmail) {
    return (
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "32px 20px 48px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "34px 24px",
            textAlign: "center",
            boxShadow: "0 12px 28px rgba(0,0,0,0.06)",
            border: "1px solid #eef2f7",
          }}
        >
          <h2
            style={{
              margin: "0 0 10px",
              color: "#111827",
              fontWeight: "800",
            }}
          >
            Sign in to view your orders
          </h2>
          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: "15px",
            }}
          >
            Please sign in to track your placed orders and delivery progress.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        maxWidth: "1260px",
        margin: "0 auto",
        padding: "32px 20px 48px",
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{
            margin: "0 0 8px",
            fontSize: "34px",
            fontWeight: "800",
            color: "#111827",
          }}
        >
          {pageTitle}
        </h1>
        <p
          style={{
            margin: 0,
            color: "#6b7280",
            fontSize: "15px",
          }}
        >
          {pageSubtitle}
        </p>
      </div>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "12px 14px",
            borderRadius: "12px",
            marginBottom: "18px",
            fontSize: "14px",
            border: "1px solid #fecaca",
          }}
        >
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "34px 24px",
            textAlign: "center",
            boxShadow: "0 12px 28px rgba(0,0,0,0.06)",
            border: "1px solid #eef2f7",
            color: "#6b7280",
          }}
        >
          {role === "admin" ? "No orders available." : "You have not placed any orders yet."}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "22px",
          }}
        >
          {orders.map((order) => {
            const statusStyles = getStatusStyles(order.status)
            const currentStepIndex = getStepIndex(order.status)

            return (
              <div
                key={order._id}
                style={{
                  background: "rgba(255,255,255,0.97)",
                  borderRadius: "24px",
                  padding: "22px",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.06)",
                  border: "1px solid #eef2f7",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    gap: "16px",
                    flexWrap: "wrap",
                    marginBottom: "18px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginBottom: "10px",
                      }}
                    >
                      <h2
                        style={{
                          margin: 0,
                          fontSize: "24px",
                          color: "#111827",
                          fontWeight: "800",
                        }}
                      >
                        {role === "admin"
                          ? order.customerName || "Guest User"
                          : `Order #${order._id.slice(-6).toUpperCase()}`}
                      </h2>

                      <span
                        style={{
                          ...statusStyles,
                          padding: "7px 12px",
                          borderRadius: "999px",
                          fontSize: "13px",
                          fontWeight: "700",
                        }}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gap: "8px",
                        color: "#4b5563",
                        fontSize: "14px",
                      }}
                    >
                      {role === "admin" && (
                        <>
                          <p style={{ margin: 0 }}>
                            <strong>Phone:</strong> {order.phone}
                          </p>
                          <p style={{ margin: 0 }}>
                            <strong>Email:</strong> {order.email || "Not provided"}
                          </p>
                        </>
                      )}

                      <p style={{ margin: 0 }}>
                        <strong>Address:</strong> {order.address}
                      </p>

                      <p style={{ margin: 0 }}>
                        <strong>Ordered On:</strong>{" "}
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: "18px",
                      padding: "16px",
                      minWidth: "260px",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 10px",
                        color: "#6b7280",
                        fontSize: "13px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Order Summary
                    </p>

                    <div
                      style={{
                        display: "grid",
                        gap: "10px",
                        color: "#374151",
                        fontSize: "14px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Total Items</span>
                        <strong>{order.totalItems}</strong>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Total Cost</span>
                        <strong>${order.totalCost}</strong>
                      </div>
                    </div>

                    {role === "admin" ? (
                      <div style={{ marginTop: "16px" }}>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "8px",
                            fontSize: "13px",
                            color: "#6b7280",
                            fontWeight: "700",
                          }}
                        >
                          Update Status
                        </label>

                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          disabled={updatingId === order._id}
                          style={{
                            width: "100%",
                            padding: "12px 14px",
                            borderRadius: "12px",
                            border: "1px solid #d1d5db",
                            background: "white",
                            fontSize: "14px",
                            outline: "none",
                            cursor: "pointer",
                          }}
                        >
                          <option>Placed</option>
                          <option>Preparing</option>
                          <option>Out for Delivery</option>
                          <option>Delivered</option>
                        </select>
                      </div>
                    ) : (
                      <div style={{ marginTop: "16px" }}>
                        <p
                          style={{
                            margin: "0 0 10px",
                            fontSize: "13px",
                            color: "#6b7280",
                            fontWeight: "700",
                          }}
                        >
                          Delivery Progress
                        </p>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: "8px",
                          }}
                        >
                          {steps.map((step, index) => {
                            const isActive = index <= currentStepIndex

                            return (
                              <div key={step} style={{ textAlign: "center" }}>
                                <div
                                  style={{
                                    width: "100%",
                                    height: "10px",
                                    borderRadius: "999px",
                                    background: isActive ? "#1B4332" : "#e5e7eb",
                                    marginBottom: "8px",
                                  }}
                                />
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: "11px",
                                    fontWeight: "700",
                                    color: isActive ? "#111827" : "#9ca3af",
                                    lineHeight: "1.3",
                                  }}
                                >
                                  {step}
                                </p>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3
                    style={{
                      margin: "0 0 14px",
                      color: "#111827",
                      fontSize: "18px",
                      fontWeight: "800",
                    }}
                  >
                    Ordered Items
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
                      gap: "16px",
                    }}
                  >
                    {(order.items || []).map((item, index) => {
                      const itemImage =
                        typeof item.image === "string" && item.image.trim() !== ""
                          ? item.image
                          : hero

                      return (
                        <div
                          key={index}
                          style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "18px",
                            padding: "12px",
                            display: "grid",
                            gridTemplateColumns: "90px 1fr",
                            gap: "12px",
                            alignItems: "center",
                            background: "#fcfcfd",
                          }}
                        >
                          <img
                            src={itemImage}
                            alt={item.name}
                            style={{
                              width: "90px",
                              height: "90px",
                              objectFit: "cover",
                              borderRadius: "14px",
                            }}
                          />

                          <div>
                            <h4
                              style={{
                                margin: "0 0 6px",
                                color: "#111827",
                                fontSize: "16px",
                                fontWeight: "800",
                              }}
                            >
                              {item.name}
                            </h4>

                            <p
                              style={{
                                margin: "0 0 4px",
                                color: "#6b7280",
                                fontSize: "14px",
                              }}
                            >
                              Qty: {item.qty}
                            </p>

                            <p
                              style={{
                                margin: 0,
                                color: "#111827",
                                fontSize: "15px",
                                fontWeight: "700",
                              }}
                            >
                              ${item.price}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
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