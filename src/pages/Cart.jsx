import { useState } from "react"

function Cart({ cart, addToCart, removeFromCart, checkout }) {
  const [customerName, setCustomerName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const handleCheckout = () => {
    if (!phone.trim() || !address.trim()) {
      alert("Please enter phone number and address")
      return
    }

    checkout({
      customerName,
      phone,
      address,
    })
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "30px 20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div style={{ display: "grid", gap: "16px", marginBottom: "30px" }}>
            {cart.map((item) => (
              <div
                key={item._id}
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "center",
                  background: "white",
                  padding: "16px",
                  borderRadius: "14px",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />

                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 8px" }}>{item.name}</h3>
                  <p style={{ margin: "0 0 8px", color: "#666" }}>
                    ${item.price} each
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button onClick={() => removeFromCart(item._id)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => addToCart(item)}>+</button>
                  </div>
                </div>

                <div style={{ fontWeight: "bold" }}>
                  ${(item.price * item.qty).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "16px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
            }}
          >
            <h2>Checkout Details</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
                marginBottom: "14px",
              }}
            >
              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                }}
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <textarea
              placeholder="Delivery Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows="4"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                marginBottom: "16px",
                boxSizing: "border-box",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <h3 style={{ margin: 0 }}>Total: ${total.toFixed(2)}</h3>

              <button
                onClick={handleCheckout}
                style={{
                  background: "#1B4332",
                  color: "white",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Place Order
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart