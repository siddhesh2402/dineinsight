import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"

function LoginPopup({ setShowLogin }) {
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

  const handleLogin = (e) => {
    e.preventDefault()
    setError("")

    const adminEmail = "admin@dineinsight.com"
    const adminPassword = "Admin@123"

    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem("role", "admin")
      localStorage.setItem("userName", "Admin")
      localStorage.setItem("userEmail", adminEmail)

      alert("Admin login successful")
      resetForm()
      setShowLogin(false)
      window.location.reload()
      return
    }

    const users = JSON.parse(localStorage.getItem("users")) || []

    const user = users.find(
      (u) => u.email === email && u.password === password
    )

    if (user) {
      localStorage.setItem("role", "user")
      localStorage.setItem("userName", user.name)
      localStorage.setItem("userEmail", user.email)

      alert("Login successful")
      resetForm()
      setShowLogin(false)
      window.location.reload()
    } else {
      setError("Invalid email or password")
    }
  }

  const handleSignup = (e) => {
    e.preventDefault()
    setError("")

    if (!passwordRegex.test(password)) {
      setError(
        "Password must contain uppercase, lowercase, number and symbol"
      )
      return
    }

    const users = JSON.parse(localStorage.getItem("users")) || []

    const emailExists = users.some((u) => u.email === email)

    if (emailExists) {
      setError("Email already registered")
      return
    }

    const newUser = {
      name,
      email,
      password,
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    alert("Account created successfully")
    switchMode("login")
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
          <form key="login-form" onSubmit={handleLogin} autoComplete="on">
            <input
              type="email"
              name="loginEmail"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="loginPassword"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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
          <form key="signup-form" onSubmit={handleSignup} autoComplete="off">
            <input
              type="text"
              name="signupName"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />

            <input
              type="email"
              name="signupEmail"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="signupPassword"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
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
