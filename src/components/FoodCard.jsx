import hero from "../assets/hero-food.jpg"

function FoodCard({ food, cart = [], addToCart, removeFromCart }) {
  const imgSrc =
    typeof food.image === "string" && food.image.trim() !== ""
      ? food.image
      : hero

  const cartItem = cart.find((item) => item._id === food._id)
  const qty = cartItem ? cartItem.qty : 0

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.96)",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 14px 32px rgba(0,0,0,0.08)",
        border: "1px solid rgba(255,255,255,0.75)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)"
        e.currentTarget.style.boxShadow = "0 18px 38px rgba(0,0,0,0.12)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = "0 14px 32px rgba(0,0,0,0.08)"
      }}
    >
      <div style={{ position: "relative" }}>
        <img
          src={imgSrc}
          alt={food.name || "Food item"}
          style={{
            width: "100%",
            height: "220px",
            objectFit: "cover",
            display: "block",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.22) 100%)",
          }}
        />

        <span
          style={{
            position: "absolute",
            top: "14px",
            left: "14px",
            background: "rgba(27,67,50,0.92)",
            color: "white",
            padding: "7px 13px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "0.2px",
            boxShadow: "0 8px 18px rgba(0,0,0,0.15)",
          }}
        >
          {food.category || "Food"}
        </span>

        <div
          style={{
            position: "absolute",
            right: "14px",
            bottom: "14px",
            background: "rgba(255,255,255,0.92)",
            color: "#111827",
            padding: "8px 12px",
            borderRadius: "999px",
            fontSize: "13px",
            fontWeight: "700",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          }}
        >
          ⭐ {food.rating ?? 4.5} ({food.reviews ?? 100})
        </div>
      </div>

      <div
        style={{
          padding: "18px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <h3
            style={{
              margin: "0 0 8px",
              fontSize: "20px",
              color: "#111827",
              fontWeight: "800",
              lineHeight: "1.25",
            }}
          >
            {food.name || "Unnamed Dish"}
          </h3>

          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: "14px",
              lineHeight: "1.6",
              minHeight: "44px",
            }}
          >
            {food.description || "Delicious dish freshly prepared."}
          </p>
        </div>

        <div
          style={{
            marginTop: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 4px",
                  color: "#6b7280",
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                }}
              >
                Price
              </p>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  color: "#111827",
                }}
              >
                ${food.price ?? 0}
              </span>
            </div>
          </div>

          {qty === 0 ? (
            <button
              onClick={() => addToCart(food)}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #1B4332 0%, #24543f 100%)",
                color: "white",
                border: "none",
                padding: "14px 16px",
                borderRadius: "14px",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "15px",
                boxShadow: "0 10px 22px rgba(27,67,50,0.24)",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              Add to Cart
            </button>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                background: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "10px 12px",
              }}
            >
              <button
                onClick={() => removeFromCart(food._id)}
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  border: "none",
                  background: "#eef2f7",
                  color: "#111827",
                  cursor: "pointer",
                  fontSize: "20px",
                  fontWeight: "800",
                }}
              >
                -
              </button>

              <div style={{ textAlign: "center", flex: 1 }}>
                <p
                  style={{
                    margin: "0 0 2px",
                    fontSize: "12px",
                    color: "#6b7280",
                    fontWeight: "600",
                  }}
                >
                  Quantity
                </p>
                <span
                  style={{
                    fontWeight: "800",
                    fontSize: "18px",
                    color: "#111827",
                  }}
                >
                  {qty}
                </span>
              </div>

              <button
                onClick={() => addToCart(food)}
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  border: "none",
                  background: "#1B4332",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "20px",
                  fontWeight: "800",
                  boxShadow: "0 8px 18px rgba(27,67,50,0.20)",
                }}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FoodCard