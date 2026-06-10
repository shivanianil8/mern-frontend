import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, Link, useSearchParams } from "react-router-dom"
import BASE_URL from "../api.js"
import "../App.css"

export default function Login() {
  const [form, setForm]       = useState({ email: "", password: "" })
  const [error, setError]     = useState("")
  const [success, setSuccess] = useState("")
  const navigate              = useNavigate()
  const [searchParams]        = useSearchParams()

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setSuccess("Email verified! You can now login.")
    }
  }, [])

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    if (!form.email.includes("@") || !form.email.includes(".")) return "Enter a valid email"
    if (form.password.length < 6) return "Password must be at least 6 characters"
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    setError("")
    try {
      const { data } = await axios.post(`${BASE_URL}/api/auth/login`, form)
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div style={styles.leftContent}>
          <h1 style={styles.brand}>Vyorra</h1>
          <p style={styles.tagline}>Shop beyond ordinary</p>
          <div style={styles.circle1} />
          <div style={styles.circle2} />
        </div>
      </div>

      <div className="auth-right">
        <div style={styles.card}>
          <h2 style={styles.title}>Welcome back</h2>
          <p style={styles.subtitle}>Sign in to your account</p>

          {error   && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} name="email" type="email"
              placeholder="Enter your email"
              value={form.email} onChange={handleChange} required />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label style={styles.label}>Password</label>
              <Link to="/forgot-password" style={styles.forgotLink}>Forgot password?</Link>
            </div>
            <input style={styles.input} name="password" type="password"
              placeholder="Enter your password"
              value={form.password} onChange={handleChange}
              maxLength={20} required />

            <button style={styles.button} type="submit">Sign In</button>
          </form>

          <p style={styles.footer}>
            No account?{" "}
            <Link to="/signup" style={styles.footerLink}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  leftContent: { position: "relative", zIndex: 2, textAlign: "center" },
  brand: {
    color: "#ffffff", fontSize: "4rem", fontWeight: "800",
    letterSpacing: "6px", textTransform: "uppercase", marginBottom: "1rem"
  },
  tagline: { color: "#555555", fontSize: "1rem", letterSpacing: "3px", textTransform: "uppercase" },
  circle1: {
    position: "absolute", width: "400px", height: "400px",
    borderRadius: "50%", top: "-100px", right: "-100px",
    background: "radial-gradient(circle, #7c3aed20, transparent)"
  },
  circle2: {
    position: "absolute", width: "300px", height: "300px",
    borderRadius: "50%", bottom: "-100px", left: "-50px",
    background: "radial-gradient(circle, #a855f715, transparent)"
  },
  card: { width: "100%", maxWidth: "400px" },
  title: { color: "#ffffff", fontSize: "2rem", fontWeight: "700", marginBottom: "0.5rem" },
  subtitle: { color: "#555555", marginBottom: "2rem", fontSize: "0.95rem" },
  label: { color: "#a0a0a0", fontSize: "0.85rem", letterSpacing: "0.5px" },
  forgotLink: { color: "#7c3aed", textDecoration: "none", fontSize: "0.85rem" },
  input: {
    width: "100%", padding: "12px 16px", margin: "0 0 20px 0",
    borderRadius: "10px", border: "1px solid #222222",
    background: "#111111", color: "#ffffff", fontSize: "1rem",
    boxSizing: "border-box", outline: "none"
  },
  button: {
    width: "100%", padding: "14px", background: "#7c3aed",
    color: "#ffffff", border: "none", borderRadius: "10px",
    cursor: "pointer", fontSize: "1rem", fontWeight: "600",
    marginTop: "8px", letterSpacing: "0.5px"
  },
  footer: { color: "#555555", textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem" },
  footerLink: { color: "#7c3aed", textDecoration: "none", fontWeight: "600" },
  error: {
    color: "#ef4444", fontSize: "0.85rem", marginBottom: "1rem",
    padding: "10px", background: "#ef444410", borderRadius: "8px",
    border: "1px solid #ef444430"
  },
  success: {
    color: "#22c55e", fontSize: "0.85rem", marginBottom: "1rem",
    padding: "10px", background: "#22c55e10", borderRadius: "8px",
    border: "1px solid #22c55e30"
  }
}