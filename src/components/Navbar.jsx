import { Link } from "react-router-dom"

function Navbar({ cartCount, setShowLogin }) {
  const user = localStorage.getItem("userName")
  const role = localStorage.getItem("role")

  const logout = () => {
    localStorage.removeItem("role")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
    window.location.href = "/"
  }

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
  }

  return (
    <div
      style={{
        background: "#1B4332",
        color: "white",
        padding: "15px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ margin: 0 }}>DineInsight</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <Link to="/" style={linkStyle}>
          Home
        </Link>

        <Link to="/cart" style={linkStyle}>
          Cart ({cartCount})
        </Link>

        {role === "admin" && (
          <>
            <Link to="/admin" style={linkStyle}>
              Admin
            </Link>

            <Link to="/orders" style={linkStyle}>
              Orders
            </Link>
          </>
        )}

        {user ? (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span>👤 {user}</span>

            <button
              onClick={logout}
              style={{
                padding: "6px 12px",
                border: "none",
                borderRadius: "6px",
                background: "#ff5a3c",
                color: "white",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            style={{
              padding: "6px 12px",
              border: "none",
              borderRadius: "6px",
              background: "#ff5a3c",
              color: "white",
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  )
}

export default Navbar