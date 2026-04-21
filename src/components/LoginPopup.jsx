import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { toast } from "react-hot-toast"

function LoginPopup({ setShowLogin }) {
  const API_URL = import.meta.env.VITE_API_URL

  const [mode, setMode] = useState("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/

  const resetForm = () => {
    setName("")
    setEmail("")
    setPassword("")
    setError("")
    setShowPassword(false)
    setLoading(false)
  }

  const switchMode = (nextMode) => {
    resetForm()
    setMode(nextMode)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Login failed")
        setLoading(false)
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("role", data.user.role)
      localStorage.setItem("userName", data.user.name)
      localStorage.setItem("userEmail", data.user.email)

      toast.success("Login successful")
      resetForm()
      setShowLogin(false)
      window.location.reload()
    } catch (error) {
      console.error("Login error:", error)
      setError("Something went wrong")
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!passwordRegex.test(password)) {
      setError(
        "Password must contain uppercase, lowercase, number and symbol"
      )
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Signup failed")
        setLoading(false)
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("role", data.user.role)
      localStorage.setItem("userName", data.user.name)
      localStorage.setItem("userEmail", data.user.email)

      toast.success("Account created successfully")
      resetForm()
      setShowLogin(false)
      window.location.reload()
    } catch (error) {
      console.error("Signup error:", error)
      setError("Something went wrong")
      setLoading(false)
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    marginBottom: "14px",
    borderRadius: "14px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "14px",
    background: "#f9fafb",
    boxSizing: "border-box",
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.55)",
        backdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          width: "100%",
          maxWidth: "420px",
          borderRadius: "24px",
          padding: "30px",
          position: "relative",
          boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
          border: "1px solid #eef2f7",
        }}
      >
        <button
          onClick={() => {
            resetForm()
            setShowLogin(false)
          }}
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "none",
            background: "#f3f4f6",
            cursor: "pointer",
            fontSize: "18px",
            color: "#374151",
          }}
        >
          ✕
        </button>

        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #1B4332 0%, #2d6a4f 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "800",
              fontSize: "20px",
              marginBottom: "14px",
              boxShadow: "0 12px 24px rgba(27,67,50,0.22)",
            }}
          >
            D
          </div>

          <h2
            style={{
              margin: "0 0 8px",
              fontSize: "28px",
              fontWeight: "800",
              color: "#111827",
            }}
          >
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>

          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#6b7280",
              lineHeight: "1.6",
            }}
          >
            {mode === "login"
              ? "Sign in to continue ordering your favorite dishes."
              : "Join DineInsight and start ordering with a smoother experience."}
          </p>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLogin} autoComplete="on">
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "700",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />

            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "700",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative", marginBottom: "14px" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ ...inputStyle, marginBottom: 0, paddingRight: "46px" }}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#6b7280",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {error && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#b91c1c",
                  border: "1px solid #fecaca",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  fontSize: "13px",
                  marginBottom: "14px",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "6px",
                padding: "14px",
                background: "linear-gradient(135deg, #1B4332 0%, #2d6a4f 100%)",
                color: "white",
                border: "none",
                borderRadius: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "800",
                fontSize: "15px",
                boxShadow: "0 12px 24px rgba(27,67,50,0.22)",
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} autoComplete="off">
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "700",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />

            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "700",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />

            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "700",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ ...inputStyle, paddingRight: "46px" }}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "40%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#6b7280",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <p
              style={{
                fontSize: "12px",
                color: "#6b7280",
                marginTop: "4px",
                marginBottom: "14px",
                lineHeight: "1.5",
              }}
            >
              Use at least 8 characters with uppercase, lowercase, number, and
              symbol.
            </p>

            {error && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#b91c1c",
                  border: "1px solid #fecaca",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  fontSize: "13px",
                  marginBottom: "14px",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "6px",
                padding: "14px",
                background: "linear-gradient(135deg, #1B4332 0%, #2d6a4f 100%)",
                color: "white",
                border: "none",
                borderRadius: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "800",
                fontSize: "15px",
                boxShadow: "0 12px 24px rgba(27,67,50,0.22)",
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        )}

        <div
          style={{
            marginTop: "18px",
            textAlign: "center",
            fontSize: "14px",
            color: "#6b7280",
          }}
        >
          {mode === "login" ? (
            <p style={{ margin: 0 }}>
              Create a new account?{" "}
              <span
                onClick={() => switchMode("signup")}
                style={{
                  color: "#1B4332",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                Sign up
              </span>
            </p>
          ) : (
            <p style={{ margin: 0 }}>
              Already have an account?{" "}
              <span
                onClick={() => switchMode("login")}
                style={{
                  color: "#1B4332",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                Login
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginPopup