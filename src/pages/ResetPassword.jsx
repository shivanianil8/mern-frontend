import { useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import BASE_URL from "../api.js"

export default function ResetPassword() {
  const [form, setForm]       = useState({ password: "", confirm: "" })
  const [error, setError]     = useState("")
  const [success, setSuccess] = useState("")
  const navigate              = useNavigate()
  const { token }             = useParams()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match")
      return
    }

    try {
      await axios.post(
        `${BASE_URL}/api/auth/reset-password/${token}`,
        { password: form.password }
      )
      setSuccess("Password reset successful! Redirecting to login...")
      setTimeout(() => navigate("/login"), 2000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password")
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Reset Password</h2>
        <p style={styles.subtitle}>Enter your new password</p>

        {error   && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>New Password</label>
          <input style={styles.input} type="password"
            placeholder="Minimum 6 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            maxLength={20} required />

          <label style={styles.label}>Confirm Password</label>
          <input style={styles.input} type="password"
            placeholder="Confirm your password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            maxLength={20} required />

          <button style={styles.button} type="submit">Reset Password</button>
        </form>
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
  subtitle: { color: "#555555", marginBottom: "2rem", fontSize: "0.95rem" },
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
  error: {
    color: "#ef4444", fontSize: "0.85rem", marginBottom: "1rem",
    padding: "10px", background: "#ef444410", borderRadius: "8px"
  },
  success: {
    color: "#22c55e", fontSize: "0.85rem", marginBottom: "1rem",
    padding: "10px", background: "#22c55e10", borderRadius: "8px"
  }
}