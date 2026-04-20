import { useEffect, useMemo, useState } from "react"
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

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      alert("Please login first to place your order")
      setShowLogin(true)
      return
    }

    if (cart.length === 0) {
      alert("Your cart is empty")
      return
    }

    if (!phone.trim() || !address.trim()) {
      alert("Please enter phone number and address")
      return
    }

    localStorage.setItem("deliveryAddress", address.trim())

    try {
      await checkout({
        customerName,
        phone,
        address: address.trim(),
      })

      setPhone("")
    } catch (error) {
      console.error("Checkout failed:", error)
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
    background: "white",
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
            padding: "36px 24px",
            textAlign: "center",
            boxShadow: "0 12px 28px rgba(0,0,0,0.06)",
            border: "1px solid #eef2f7",
          }}
        >
          <h2
            style={{
              margin: "0 0 10px",
              color: "#111827",
              fontSize: "24px",
            }}
          >
            Your cart is empty
          </h2>
          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: "15px",
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
              background: "rgba(255,255,255,0.96)",
              borderRadius: "24px",
              padding: "24px",
              boxShadow: "0 12px 28px rgba(0,0,0,0.06)",
              border: "1px solid #eef2f7",
              position: "sticky",
              top: "96px",
            }}
          >
            <h2
              style={{
                margin: "0 0 16px",
                color: "#111827",
                fontSize: "24px",
                fontWeight: "800",
              }}
            >
              Checkout Details
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                marginBottom: "20px",
              }}
            >
              <input
                type="text"
                placeholder="Your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={inputStyle}
              />

              <input
                type="text"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
              />

              <textarea
                placeholder="Delivery address"
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

            <div
              style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "18px",
                padding: "16px",
                marginBottom: "20px",
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
                  color: "#111827",
                  fontSize: "20px",
                  fontWeight: "800",
                }}
              >
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {!isLoggedIn && (
              <p
                style={{
                  marginTop: "0",
                  marginBottom: "14px",
                  fontSize: "14px",
                  color: "#b91c1c",
                  fontWeight: "600",
                }}
              >
                You must log in before placing an order.
              </p>
            )}

            <button
              onClick={handleCheckout}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #1B4332 0%, #2d6a4f 100%)",
                color: "white",
                border: "none",
                padding: "15px 18px",
                borderRadius: "16px",
                cursor: "pointer",
                fontWeight: "800",
                fontSize: "15px",
                boxShadow: "0 12px 24px rgba(27,67,50,0.22)",
                opacity: isLoggedIn ? 1 : 0.85,
              }}
            >
              {isLoggedIn ? "Place Order" : "Login to Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart