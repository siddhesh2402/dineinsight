import { useEffect, useMemo, useState } from "react"
import { toast } from "react-hot-toast"
import hero from "../assets/hero-food.jpg"

function Cart({
  cart = [],
  addToCart,
  removeFromCart,
  checkout,
  isLoggedIn,
  setShowLogin,
}) {
  const savedAddress = localStorage.getItem("deliveryAddress") || ""
  const savedUserName = localStorage.getItem("userName") || ""

  const [customerName, setCustomerName] = useState(savedUserName)
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState(savedAddress)
  const [placingOrder, setPlacingOrder] = useState(false)

  useEffect(() => {
    setAddress(localStorage.getItem("deliveryAddress") || "")
  }, [])

  useEffect(() => {
    setCustomerName(localStorage.getItem("userName") || "")
  }, [])

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  }, [cart])

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty, 0)
  }, [cart])

  const deliveryFee = 0
  const finalTotal = total + deliveryFee

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      toast.error("Please login first to place your order")
      setShowLogin(true)
      return
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    if (!phone.trim() || !address.trim()) {
      toast.error("Please enter phone number and address")
      return
    }

    localStorage.setItem("deliveryAddress", address.trim())
    setPlacingOrder(true)

    try {
      await checkout({
        customerName,
        phone,
        address: address.trim(),
      })

      setPhone("")
    } catch (error) {
      console.error("Checkout failed:", error)
    } finally {
      setPlacingOrder(false)
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
    background: "#f9fafb",
    color: "#111827",
  }

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: "700",
    color: "#374151",
    marginBottom: "8px",
  }

  return (
    <div
      style={{
        maxWidth: "1260px",
        margin: "0 auto",
        padding: "32px 20px 48px",
      }}
    >
      <div
        style={{
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            margin: "0 0 8px",
            fontSize: "34px",
            fontWeight: "800",
            color: "#111827",
          }}
        >
          Your Cart
        </h1>
        <p
          style={{
            margin: 0,
            color: "#6b7280",
            fontSize: "15px",
          }}
        >
          Review your selected dishes and complete your order.
        </p>
      </div>

      {cart.length === 0 ? (
        <div
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "42px 24px",
            textAlign: "center",
            boxShadow: "0 12px 28px rgba(0,0,0,0.06)",
            border: "1px solid #eef2f7",
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
            🛒
          </div>

          <h2
            style={{
              margin: "0 0 10px",
              color: "#111827",
              fontSize: "24px",
              fontWeight: "800",
            }}
          >
            Your cart is empty
          </h2>
          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: "15px",
              lineHeight: "1.6",
            }}
          >
            Add some delicious dishes from the menu page to get started.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {cart.map((item) => {
              const imgSrc =
                typeof item.image === "string" && item.image.trim() !== ""
                  ? item.image
                  : hero

              return (
                <div
                  key={item._id}
                  style={{
                    background: "rgba(255,255,255,0.96)",
                    borderRadius: "22px",
                    overflow: "hidden",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.06)",
                    border: "1px solid #eef2f7",
                    display: "grid",
                    gridTemplateColumns: "140px 1fr auto",
                    gap: "18px",
                    padding: "16px",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={imgSrc}
                    alt={item.name}
                    style={{
                      width: "140px",
                      height: "110px",
                      objectFit: "cover",
                      borderRadius: "16px",
                    }}
                  />

                  <div>
                    <h3
                      style={{
                        margin: "0 0 6px",
                        fontSize: "20px",
                        color: "#111827",
                        fontWeight: "800",
                      }}
                    >
                      {item.name}
                    </h3>

                    <p
                      style={{
                        margin: "0 0 10px",
                        fontSize: "14px",
                        color: "#6b7280",
                        lineHeight: "1.5",
                      }}
                    >
                      {item.description || "Freshly prepared dish"}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          background: "#f9fafb",
                          border: "1px solid #e5e7eb",
                          color: "#374151",
                          padding: "7px 12px",
                          borderRadius: "999px",
                          fontSize: "13px",
                          fontWeight: "700",
                        }}
                      >
                        ${item.price} each
                      </span>

                      <span
                        style={{
                          background: "#ecfdf5",
                          border: "1px solid #d1fae5",
                          color: "#065f46",
                          padding: "7px 12px",
                          borderRadius: "999px",
                          fontSize: "13px",
                          fontWeight: "700",
                        }}
                      >
                        Qty: {item.qty}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "800",
                        color: "#111827",
                      }}
                    >
                      ${(item.price * item.qty).toFixed(2)}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        background: "#f8fafc",
                        border: "1px solid #e5e7eb",
                        borderRadius: "16px",
                        padding: "8px 10px",
                      }}
                    >
                      <button
                        onClick={() => removeFromCart(item._id)}
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "50%",
                          border: "none",
                          background: "#eef2f7",
                          color: "#111827",
                          cursor: "pointer",
                          fontSize: "18px",
                          fontWeight: "800",
                        }}
                      >
                        -
                      </button>

                      <span
                        style={{
                          minWidth: "22px",
                          textAlign: "center",
                          fontWeight: "800",
                          fontSize: "16px",
                          color: "#111827",
                        }}
                      >
                        {item.qty}
                      </span>

                      <button
                        onClick={() => addToCart(item)}
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "50%",
                          border: "none",
                          background: "#1B4332",
                          color: "white",
                          cursor: "pointer",
                          fontSize: "18px",
                          fontWeight: "800",
                          boxShadow: "0 8px 18px rgba(27,67,50,0.18)",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.98)",
              borderRadius: "24px",
              padding: "24px",
              boxShadow: "0 12px 28px rgba(0,0,0,0.06)",
              border: "1px solid #eef2f7",
              position: "sticky",
              top: "96px",
            }}
          >
            <div style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  margin: "0 0 8px",
                  color: "#111827",
                  fontSize: "24px",
                  fontWeight: "800",
                }}
              >
                Checkout Details
              </h2>
              <p
                style={{
                  margin: 0,
                  color: "#6b7280",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                Fill in your delivery details and review the total before placing
                the order.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                marginBottom: "22px",
              }}
            >
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Phone Number</label>
                <input
                  type="text"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Delivery Address</label>
                <textarea
                  placeholder="Enter your delivery address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={4}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    minHeight: "110px",
                    fontFamily: "Arial, sans-serif",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "18px",
                padding: "16px",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                <span>Total Items</span>
                <span style={{ fontWeight: "700" }}>{totalItems}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                <span>Subtotal</span>
                <span style={{ fontWeight: "700" }}>${total.toFixed(2)}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                <span>Delivery Fee</span>
                <span style={{ fontWeight: "700" }}>
                  {deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>

              <div
                style={{
                  borderTop: "1px solid #e5e7eb",
                  paddingTop: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#111827",
                  fontSize: "20px",
                  fontWeight: "800",
                }}
              >
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {!isLoggedIn && (
              <div
                style={{
                  background: "#fff7ed",
                  color: "#c2410c",
                  border: "1px solid #fdba74",
                  borderRadius: "14px",
                  padding: "12px 14px",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  marginBottom: "16px",
                }}
              >
                Please sign in first to place your order.
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={placingOrder}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #1B4332 0%, #2d6a4f 100%)",
                color: "white",
                border: "none",
                padding: "15px 18px",
                borderRadius: "16px",
                cursor: placingOrder ? "not-allowed" : "pointer",
                fontWeight: "800",
                fontSize: "15px",
                boxShadow: "0 12px 24px rgba(27,67,50,0.22)",
                opacity: placingOrder ? 0.8 : isLoggedIn ? 1 : 0.9,
              }}
            >
              {placingOrder
                ? "Placing Order..."
                : isLoggedIn
                ? "Place Order"
                : "Login to Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart