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

      const token = localStorage.getItem("token")

      const res = await fetch(`${API_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

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

      const token = localStorage.getItem("token")

      const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

  const cardStyle = {
    background: "rgba(255,255,255,0.98)",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 14px 34px rgba(0,0,0,0.07)",
    border: "1px solid #eef2f7",
  }

  if (role !== "admin" && !userEmail) {
    return (
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "clamp(20px, 4vw, 36px) clamp(14px, 3vw, 24px) 52px",
        }}
      >
        <div
          style={{
            ...cardStyle,
            textAlign: "center",
            padding: "clamp(24px, 5vw, 42px) clamp(16px, 4vw, 28px)",
          }}
        >
          <div
            style={{
              width: "62px",
              height: "62px",
              margin: "0 auto 16px",
              borderRadius: "18px",
              background: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
            }}
          >
            📦
          </div>

          <h2
            style={{
              margin: "0 0 10px",
              color: "#111827",
              fontWeight: "800",
              fontSize: "28px",
            }}
          >
            Sign in to view your orders
          </h2>
          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: "15px",
              lineHeight: "1.6",
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
        maxWidth: "1360px",
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
              margin: "0 0 8px",
              fontSize: "clamp(28px, 5vw, 40px)",
              fontWeight: "800",
              color: "#111827",
              letterSpacing: "-0.5px",
            }}
          >
            {pageTitle}
          </h1>
          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: "15px",
              lineHeight: "1.6",
            }}
          >
            {pageSubtitle}
          </p>
        </div>

        <button
          onClick={fetchOrders}
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
          Refresh Orders
        </button>
      </div>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "12px 14px",
            borderRadius: "14px",
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
            ...cardStyle,
            textAlign: "center",
            color: "#6b7280",
            padding: "clamp(24px, 5vw, 42px) clamp(16px, 4vw, 28px)",
          }}
        >
          <div
            style={{
              width: "62px",
              height: "62px",
              margin: "0 auto 16px",
              borderRadius: "18px",
              background: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
            }}
          >
            🧾
          </div>

          <h2
            style={{
              margin: "0 0 10px",
              color: "#111827",
              fontSize: "26px",
              fontWeight: "800",
            }}
          >
            {role === "admin" ? "No orders available" : "No orders yet"}
          </h2>

          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: "15px",
              lineHeight: "1.6",
            }}
          >
            {role === "admin"
              ? "Orders will appear here once customers start placing them."
              : "You have not placed any orders yet."}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "24px",
          }}
        >
          {orders.map((order) => {
            const statusStyles = getStatusStyles(order.status)
            const currentStepIndex = getStepIndex(order.status)

            return (
              <div
                key={order._id}
                style={{
                  ...cardStyle,
                  padding: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    gap: "18px",
                    flexWrap: "wrap",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ flex: "1 1 420px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginBottom: "12px",
                      }}
                    >
                      <h2
                        style={{
                          margin: 0,
                          fontSize: role === "admin" ? "28px" : "24px",
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
                        lineHeight: "1.6",
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
                      borderRadius: "20px",
                      padding: "18px",
                      minWidth: "260px",
                      flex: "1 1 300px",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 12px",
                        color: "#6b7280",
                        fontSize: "12px",
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
                        gap: "12px",
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
                      <div style={{ marginTop: "18px" }}>
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
                            cursor:
                              updatingId === order._id ? "not-allowed" : "pointer",
                            opacity: updatingId === order._id ? 0.8 : 1,
                          }}
                        >
                          <option>Placed</option>
                          <option>Preparing</option>
                          <option>Out for Delivery</option>
                          <option>Delivered</option>
                        </select>
                      </div>
                    ) : (
                      <div style={{ marginTop: "18px" }}>
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
                      margin: "0 0 16px",
                      color: "#111827",
                      fontSize: "20px",
                      fontWeight: "800",
                    }}
                  >
                    Ordered Items
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
                      gap: "14px",
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
                            borderRadius: "20px",
                            padding: "14px",
                            display: "grid",
                            gridTemplateColumns: "80px 1fr",
                            gap: "12px",
                            alignItems: "center",
                            background: "#fcfcfd",
                          }}
                        >
                          <img
                            src={itemImage}
                            alt={item.name}
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              borderRadius: "14px",
                            }}
                          />

                          <div>
                            <h4
                              style={{
                                margin: "0 0 6px",
                                color: "#111827",
                                fontSize: "17px",
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