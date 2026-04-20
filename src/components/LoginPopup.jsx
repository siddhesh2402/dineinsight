import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"

function LoginPopup({ setShowLogin }) {
  const API_URL = import.meta.env.VITE_API_URL

  const [mode, setMode] = useState("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/

  const resetForm = () => {
    setName("")
    setEmail("")
    setPassword("")
    setError("")
    setShowPassword(false)
  }

  const switchMode = (nextMode) => {
    resetForm()
    setMode(nextMode)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

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
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("role", data.user.role)
      localStorage.setItem("userName", data.user.name)
      localStorage.setItem("userEmail", data.user.email)

      alert("Login successful")
      resetForm()
      setShowLogin(false)
      window.location.reload()
    } catch (error) {
      console.error("Login error:", error)
      setError("Something went wrong")
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError("")

    if (!passwordRegex.test(password)) {
      setError(
        "Password must contain uppercase, lowercase, number and symbol"
      )
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
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("role", data.user.role)
      localStorage.setItem("userName", data.user.name)
      localStorage.setItem("userEmail", data.user.email)

      alert("Account created successfully")
      resetForm()
      setShowLogin(false)
      window.location.reload()
    } catch (error) {
      console.error("Signup error:", error)
      setError("Something went wrong")
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "35px",
          width: "360px",
          borderRadius: "10px",
          position: "relative",
        }}
      >
        <span
          onClick={() => {
            resetForm()
            setShowLogin(false)
          }}
          style={{
            position: "absolute",
            right: "15px",
            top: "10px",
            cursor: "pointer",
            fontSize: "20px",
          }}
        >
          ✕
        </span>

        <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>

        {mode === "login" ? (
          <form onSubmit={handleLogin} autoComplete="on">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", padding: "10px" }}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "10px",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button
              type="submit"
              style={{
                width: "100%",
                marginTop: "15px",
                padding: "12px",
                background: "#ff5a3c",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} autoComplete="off">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", padding: "10px" }}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "10px",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <p style={{ fontSize: "12px", color: "#777", marginTop: "8px" }}>
              Password must contain uppercase, lowercase, number and symbol.
            </p>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button
              type="submit"
              style={{
                width: "100%",
                marginTop: "15px",
                padding: "12px",
                background: "#ff5a3c",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Create Account
            </button>
          </form>
        )}

        {mode === "login" ? (
          <p>
            Create a new account?{" "}
            <span
              onClick={() => switchMode("signup")}
              style={{ color: "#ff5a3c", cursor: "pointer" }}
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => switchMode("login")}
              style={{ color: "#ff5a3c", cursor: "pointer" }}
            >
              Login here
            </span>
          </p>
        )}
      </div>
    </div>
  )
}

export default LoginPopup