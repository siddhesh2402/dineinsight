import hero from "../assets/hero-food.jpg"

function FoodCard({ food, cart, addToCart, removeFromCart }) {
  const imgSrc =
    food.image && food.image.trim() !== "" ? food.image : hero

  const cartItem = cart.find((item) => item._id === food._id)
  const qty = cartItem ? cartItem.qty : 0

  return (
    <div
      style={{
        background: "white",
        borderRadius: "18px",
        overflow: "hidden",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        border: "1px solid #f0f0f0",
        transition: "all 0.25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)"
      }}
    >
      <div style={{ position: "relative" }}>
        <img
          src={imgSrc}
          alt={food.name}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
          }}
        />

        <span
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            background: "#1B4332",
            color: "white",
            padding: "6px 12px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          {food.category}
        </span>
      </div>

      <div style={{ padding: "16px" }}>
        <h3
          style={{
            margin: "0 0 8px",
            fontSize: "18px",
            color: "#111827",
          }}
        >
          {food.name}
        </h3>

        <p
          style={{
            margin: "0 0 12px",
            color: "#6b7280",
            fontSize: "14px",
            minHeight: "40px",
          }}
        >
          {food.description || "Delicious dish freshly prepared."}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <span
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#111827",
            }}
          >
            ${food.price}
          </span>

          <span
            style={{
              fontSize: "13px",
              color: "#f59e0b",
              fontWeight: "600",
            }}
          >
            ⭐ {food.rating || 4.5} ({food.reviews || 100})
          </span>
        </div>

        {qty === 0 ? (
          <button
            onClick={() => addToCart(food)}
            style={{
              width: "100%",
              background: "#1B4332",
              color: "white",
              border: "none",
              padding: "12px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#16382a"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#1B4332"
            }}
          >
            Add to Cart
          </button>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
              marginTop: "8px",
            }}
          >
            <button
              onClick={() => removeFromCart(food._id)}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                border: "none",
                background: "#f3f4f6",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "700",
              }}
            >
              -
            </button>

            <span
              style={{
                minWidth: "24px",
                textAlign: "center",
                fontWeight: "700",
                fontSize: "16px",
                color: "#111827",
              }}
            >
              {qty}
            </span>

            <button
              onClick={() => addToCart(food)}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                border: "none",
                background: "#1B4332",
                color: "white",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "700",
              }}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FoodCard