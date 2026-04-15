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
    color: "#111827",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "14px",
    padding: "10px 14px",
    borderRadius: "999px",
    transition: "all 0.2s ease",
  }

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backdropFilter: "blur(12px)",
        background: "rgba(255,255,255,0.85)",
        borderBottom: "1px solid rgba(229,231,235,0.9)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "14px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#111827",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #1B4332 0%, #2d6a4f 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "800",
                fontSize: "16px",
                boxShadow: "0 10px 22px rgba(27,67,50,0.22)",
              }}
            >
              D
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "22px",
                  fontWeight: "800",
                  color: "#111827",
                  lineHeight: 1.1,
                }}
              >
                DineInsight
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: "#6b7280",
                  fontWeight: "600",
                }}
              >
                Food ordering platform
              </p>
            </div>
          </div>
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/"
            style={{
              ...linkStyle,
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
            }}
          >
            Home
          </Link>

          <Link
            to="/cart"
            style={{
              ...linkStyle,
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
            }}
          >
            Cart ({cartCount})
          </Link>

          {role === "admin" && (
            <>
              <Link
                to="/admin"
                style={{
                  ...linkStyle,
                  background: "#ecfdf5",
                  border: "1px solid #d1fae5",
                  color: "#065f46",
                }}
              >
                Admin
              </Link>

              <Link
                to="/orders"
                style={{
                  ...linkStyle,
                  background: "#eff6ff",
                  border: "1px solid #dbeafe",
                  color: "#1d4ed8",
                }}
              >
                Orders
              </Link>
            </>
          )}

          {user ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "999px",
                padding: "6px 8px 6px 12px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.04)",
              }}
            >
              <span
                style={{
                  color: "#374151",
                  fontWeight: "700",
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                }}
              >
                👤 {user}
              </span>

              <button
                onClick={logout}
                style={{
                  padding: "10px 14px",
                  border: "none",
                  borderRadius: "999px",
                  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "13px",
                  boxShadow: "0 8px 18px rgba(220,38,38,0.18)",
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              style={{
                padding: "11px 16px",
                border: "none",
                borderRadius: "999px",
                background: "linear-gradient(135deg, #1B4332 0%, #2d6a4f 100%)",
                color: "white",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "14px",
                boxShadow: "0 10px 22px rgba(27,67,50,0.22)",
              }}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar