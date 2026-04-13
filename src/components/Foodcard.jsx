import hero from "../assets/hero-food.jpg"

function FoodCard({ food, cart, addToCart, removeFromCart }) {
  const cartItem = cart.find((item) => item._id === food._id)
  const qty = cartItem ? cartItem.qty : 0

  const imageSrc =
    food.image && food.image.trim() !== "" ? food.image : hero

  return (
    <div
      style={{
        background: "white",
        borderRadius: "10px",
        padding: "15px",
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <img
        src={imageSrc}
        alt={food.name}
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />

      <h3>{food.name}</h3>

      <div style={{ color: "#FFA41C", marginBottom: "6px" }}>
        {"⭐".repeat(Math.floor(food.rating || 0))} {food.rating} ({food.reviews})
      </div>

      <p>${food.price}</p>

      {qty === 0 ? (
        <button
          onClick={() => addToCart(food)}
          style={{
            background: "#1B4332",
            color: "white",
            border: "none",
            padding: "8px 18px",
            borderRadius: "20px",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <button
            onClick={() => removeFromCart(food._id)}
            style={{
              padding: "5px 12px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            -
          </button>

          <span>{qty}</span>

          <button
            onClick={() => addToCart(food)}
            style={{
              padding: "5px 12px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            +
          </button>
        </div>
      )}
    </div>
  )
}

export default FoodCard