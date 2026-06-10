import { useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import BASE_URL from "../api.js"

export default function ForgotPassword() {
  const [email, setEmail]     = useState("")
  const [error, setError]     = useState("")
  const [sent, setSent]       = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email })
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link")
    }
  }

  if (sent) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📧</div>
          <h2 style={styles.title}>Check your email</h2>
          <p style={{ color: "#a0a0a0", lineHeight: 1.7, marginBottom: "1rem" }}>
            We sent a password reset link to{" "}
            <strong style={{ color: "#ffffff" }}>{email}</strong>
          </p>
          <p style={{ color: "#555555", fontSize: "0.85rem" }}>
            Link expires in 1 hour. Check your spam folder.
          </p>
          <Link to="/login" style={styles.backLink}>Back to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Forgot Password?</h2>
        <p style={styles.subtitle}>
          Enter your email and we'll send you a reset link
        </p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email</label>
          <input style={styles.input} type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required />
          <button style={styles.button} type="submit">
            Send Reset Link
          </button>
        </form>

        <Link to="/login" style={styles.backLink}>← Back to Login</Link>
      </div>
    </div>
  )
}

const styles = {
  page: {
    display: "flex", justifyContent: "center",
    alignItems: "center", minHeight: "100vh", background: "#0a0a0a"
  },
  card: { width: "100%", maxWidth: "400px", padding: "2rem" },
  title: { color: "#ffffff", fontSize: "2rem", fontWeight: "700", marginBottom: "0.5rem" },
  subtitle: { color: "#555555", marginBottom: "2rem", fontSize: "0.95rem", lineHeight: 1.6 },
  label: { display: "block", color: "#a0a0a0", fontSize: "0.85rem", marginBottom: "8px" },
  input: {
    width: "100%", padding: "12px 16px", margin: "0 0 20px 0",
    borderRadius: "10px", border: "1px solid #222222",
    background: "#111111", color: "#ffffff", fontSize: "1rem",
    boxSizing: "border-box", outline: "none"
  },
  button: {
    width: "100%", padding: "14px", background: "#7c3aed",
    color: "#ffffff", border: "none", borderRadius: "10px",
    cursor: "pointer", fontSize: "1rem", fontWeight: "600"
  },
  backLink: {
    display: "block", color: "#7c3aed", textDecoration: "none",
    textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem"
  },
  error: {
    color: "#ef4444", fontSize: "0.85rem", marginBottom: "1rem",
    padding: "10px", background: "#ef444410", borderRadius: "8px"
  }
}