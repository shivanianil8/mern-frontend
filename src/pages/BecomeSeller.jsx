import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import BASE_URL from "../api.js"

export default function BecomeSeller() {
  const [form, setForm] = useState({
    shopName: "", shopDescription: "", shopLogo: ""
  })
  const [error, setError]     = useState("")
  const [success, setSuccess] = useState("")
  const navigate              = useNavigate()
  const token = localStorage.getItem("token")

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "shopName" && value.length > 50) return
    if (name === "shopDescription" && value.length > 200) return
    setForm({ ...form, [name]: value })
  }

  const validate = () => {
    if (form.shopName.trim().length < 2) return "Shop name must be at least 2 characters"
    if (form.shopDescription.trim().length < 10) return "Description must be at least 10 characters"
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError("")
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/auth/become-seller`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      localStorage.setItem("user", JSON.stringify(data.user))
      setSuccess("You are now a seller!")
      setTimeout(() => navigate("/seller-dashboard"), 1500)
    } catch (err) {
      setError(err.response?.data?.message || "Failed")
    }
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.badge}>🏪 Seller Account</div>
          <h2 style={styles.title}>Start Selling on Vyorra</h2>
          <p style={styles.subtitle}>
            Set up your shop and start listing products for millions of buyers
          </p>
        </div>

        {/* Benefits */}
        <div style={styles.benefits}>
          {[
            { icon: "📦", text: "List unlimited products" },
            { icon: "💰", text: "Earn from every sale" },
            { icon: "📊", text: "Track your shop analytics" },
            { icon: "🔄", text: "Switch between buyer and seller anytime" }
          ].map((b, i) => (
            <div key={i} style={styles.benefit}>
              <span style={{ fontSize: "1.5rem" }}>{b.icon}</span>
              <span style={styles.benefitText}>{b.text}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Set up your shop</h3>

          {error   && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Shop Name</label>
            <input style={styles.input} name="shopName"
              placeholder="e.g. Shivani's Store"
              value={form.shopName} onChange={handleChange}
              maxLength={50} required />
            <small style={styles.hint}>{form.shopName.length}/50</small>

            <label style={styles.label}>Shop Description</label>
            <textarea style={styles.textarea} name="shopDescription"
              placeholder="Tell buyers what you sell..."
              value={form.shopDescription} onChange={handleChange}
              maxLength={200} required />
            <small style={styles.hint}>{form.shopDescription.length}/200</small>

            <label style={styles.label}>Shop Logo URL (optional)</label>
            <input style={styles.input} name="shopLogo"
              placeholder="Paste logo image URL"
              value={form.shopLogo} onChange={handleChange} />

            <button style={styles.button} type="submit">
              Create Seller Account
            </button>
            <button style={styles.cancel} type="button"
              onClick={() => navigate("/dashboard")}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: "600px", margin: "0 auto", padding: "4rem 2rem" },
  header: { textAlign: "center", marginBottom: "2rem" },
  badge: {
    display: "inline-block", background: "#7c3aed20",
    color: "#a855f7", padding: "6px 16px", borderRadius: "20px",
    fontSize: "0.85rem", marginBottom: "1rem", border: "1px solid #7c3aed30"
  },
  title: { color: "#ffffff", fontSize: "2rem", fontWeight: "700", marginBottom: "0.5rem" },
  subtitle: { color: "#555555", fontSize: "0.95rem", lineHeight: 1.6 },
  benefits: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: "1rem", marginBottom: "2rem"
  },
  benefit: {
    background: "#111111", borderRadius: "12px",
    padding: "1rem", display: "flex",
    alignItems: "center", gap: "0.75rem",
    border: "1px solid #222222"
  },
  benefitText: { color: "#a0a0a0", fontSize: "0.85rem" },
  card: {
    background: "#111111", borderRadius: "16px",
    padding: "2rem", border: "1px solid #222222"
  },
  cardTitle: { color: "#ffffff", fontWeight: "700", marginBottom: "1.5rem", fontSize: "1.1rem" },
  label: { display: "block", color: "#a0a0a0", fontSize: "0.85rem", marginBottom: "8px" },
  input: {
    width: "100%", padding: "12px 16px", margin: "0 0 4px 0",
    borderRadius: "10px", border: "1px solid #222222",
    background: "#0a0a0a", color: "#ffffff", fontSize: "1rem",
    boxSizing: "border-box", outline: "none"
  },
  textarea: {
    width: "100%", padding: "12px 16px", margin: "0 0 4px 0",
    borderRadius: "10px", border: "1px solid #222222",
    background: "#0a0a0a", color: "#ffffff", fontSize: "1rem",
    boxSizing: "border-box", outline: "none",
    resize: "vertical", minHeight: "100px"
  },
  hint: { color: "#333333", fontSize: "0.75rem", display: "block", marginBottom: "20px" },
  button: {
    width: "100%", padding: "14px", background: "#7c3aed",
    color: "#ffffff", border: "none", borderRadius: "10px",
    cursor: "pointer", fontWeight: "600", marginTop: "1rem",
    fontSize: "1rem"
  },
  cancel: {
    width: "100%", padding: "14px", background: "transparent",
    color: "#555555", border: "1px solid #222222", borderRadius: "10px",
    cursor: "pointer", marginTop: "8px", fontSize: "1rem"
  },
  error: { color: "#ef4444", fontSize: "0.85rem", marginBottom: "1rem", padding: "10px", background: "#ef444410", borderRadius: "8px" },
  success: { color: "#22c55e", fontSize: "0.85rem", marginBottom: "1rem", padding: "10px", background: "#22c55e10", borderRadius: "8px" }
}