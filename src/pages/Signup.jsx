import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import BASE_URL from "../api.js"

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError]         = useState("")
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    if (form.name.trim().length < 2) return "Name must be at least 2 characters"
    if (form.name.trim().length > 50) return "Name must be less than 50 characters"
    if (!form.email.includes("@") || !form.email.includes(".")) return "Enter a valid email"
    if (form.password.length < 6) return "Password must be at least 6 characters"
    if (form.password.length > 20) return "Password must be less than 20 characters"
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    setError("")
    try {
      await axios.post(`${BASE_URL}/api/auth/signup`, form)
      setSubmitted(true)  // ← show check email screen
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed")
    }
  }

  // Check your email screen
  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.left}>
          <div style={styles.leftContent}>
            <h1 style={styles.brand}>Vyorra</h1>
            <p style={styles.tagline}>Shop beyond ordinary</p>
            <div style={styles.circle1} />
            <div style={styles.circle2} />
          </div>
        </div>
        <div style={styles.right}>
          <div style={styles.card}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📧</div>
            <h2 style={styles.title}>Check your email</h2>
            <p style={{ color: "#a0a0a0", marginBottom: "1rem", lineHeight: 1.7 }}>
              We sent a verification link to{" "}
              <strong style={{ color: "#ffffff" }}>{form.email}</strong>.
              Click the link to activate your account.
            </p>
            <p style={{ color: "#555555", fontSize: "0.85rem", marginBottom: "2rem" }}>
              Didn't receive it? Check your spam folder.
            </p>
            <button style={styles.button} onClick={() => navigate("/login")}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.leftContent}>
          <h1 style={styles.brand}>Vyorra</h1>
          <p style={styles.tagline}>Join the marketplace</p>
          <div style={styles.circle1} />
          <div style={styles.circle2} />
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Create account</h2>
          <p style={styles.subtitle}>Start buying and selling today</p>

          {error && <p style={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Full Name</label>
            <input style={styles.input} name="name"
              placeholder="Enter your full name"
              value={form.name} onChange={handleChange}
              maxLength={50} required />

            <label style={styles.label}>Email</label>
            <input style={styles.input} name="email" type="email"
              placeholder="Enter your email"
              value={form.email} onChange={handleChange} required />

            <label style={styles.label}>Password</label>
            <input style={styles.input} name="password" type="password"
              placeholder="Minimum 6 characters"
              value={form.password} onChange={handleChange}
              maxLength={20} required />

            <button style={styles.button} type="submit">Create Account</button>
          </form>

          <p style={styles.footer}>
            Already have an account?{" "}
            <Link to="/login" style={styles.footerLink}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { display: "flex", minHeight: "100vh", background: "#0a0a0a" },
  left: {
    flex: 1, display: "flex", alignItems: "center",
    justifyContent: "center", position: "relative",
    overflow: "hidden", padding: "2rem",
    background: "#0d0d0d", borderRight: "1px solid #1a1a1a"
  },
  leftContent: { position: "relative", zIndex: 2, textAlign: "center" },
  brand: {
    color: "#ffffff", fontSize: "4rem",
    fontWeight: "800", letterSpacing: "6px",
    textTransform: "uppercase", marginBottom: "1rem"
  },
  tagline: {
    color: "#555555", fontSize: "1rem",
    letterSpacing: "3px", textTransform: "uppercase"
  },
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
  right: {
    flex: 1, display: "flex", alignItems: "center",
    justifyContent: "center", padding: "2rem"
  },
  card: { width: "100%", maxWidth: "400px" },
  title: {
    color: "#ffffff", fontSize: "2rem",
    fontWeight: "700", marginBottom: "0.5rem"
  },
  subtitle: { color: "#555555", marginBottom: "2rem", fontSize: "0.95rem" },
  label: {
    display: "block", color: "#a0a0a0",
    fontSize: "0.85rem", marginBottom: "8px", letterSpacing: "0.5px"
  },
  input: {
    width: "100%", padding: "12px 16px", margin: "0 0 20px 0",
    borderRadius: "10px", border: "1px solid #222222",
    background: "#111111", color: "#ffffff",
    fontSize: "1rem", boxSizing: "border-box", outline: "none"
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
  }
}