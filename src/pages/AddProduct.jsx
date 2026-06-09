import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import BASE_URL from "../api.js"

export default function AddProduct() {
  const [form, setForm]           = useState({ name: "", price: "" })
  const [error, setError]         = useState("")
  const [success, setSuccess]     = useState("")
  const [showPopup, setShowPopup] = useState(false)
  const navigate                  = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => { checkProfile() }, [])

  const checkProfile = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/auth/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!data.user.isProfileComplete) setShowPopup(true)
    } catch (err) { console.log(err) }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "price") {
      const n = value.replace(/[^0-9]/g, "")
      if (n.length <= 7) setForm({ ...form, price: n })
      return
    }
    if (name === "name" && value.length > 100) return
    setForm({ ...form, [name]: value })
  }

  const validate = () => {
    if (form.name.trim().length < 2) return "Product name must be at least 2 characters"
    if (!form.price || Number(form.price) <= 0) return "Price must be greater than 0"
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError("")
    try {
      await axios.post(`${BASE_URL}/api/products`, form,
        { headers: { Authorization: `Bearer ${token}` } })
      setSuccess("Product added!")
      setTimeout(() => navigate("/products"), 1500)
    } catch (err) { setError(err.response?.data?.message || "Failed") }
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />

      {showPopup && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>👤</div>
            <h3 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>Complete Your Profile</h3>
            <p style={{ color: "#555555", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
              Add your phone and address to start listing products.
            </p>
            <button style={styles.popupBtn} onClick={() => navigate("/profile")}>
              Complete Profile
            </button>
            <button style={styles.popupSkip} onClick={() => setShowPopup(false)}>
              Skip for now
            </button>
          </div>
        </div>
      )}

      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Add Product</h2>
          <p style={styles.subtitle}>List your product for sale</p>
        </div>

        <div style={styles.card}>
          {error   && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Product Name</label>
            <input style={styles.input} name="name"
              placeholder="Enter product name"
              value={form.name} onChange={handleChange}
              maxLength={100} required />
            <small style={styles.hint}>{form.name.length}/100</small>

            <label style={styles.label}>Price (₹)</label>
            <input style={styles.input} name="price"
              placeholder="Enter price"
              value={form.price} onChange={handleChange}
              inputMode="numeric" required />

            <button style={styles.button} type="submit">Add Product</button>
            <button style={styles.cancel} type="button"
              onClick={() => navigate("/products")}>Cancel</button>
          </form>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    background: "rgba(0,0,0,0.8)", display: "flex",
    justifyContent: "center", alignItems: "center", zIndex: 999
  },
  popup: {
    background: "#111111", padding: "2.5rem", borderRadius: "16px",
    textAlign: "center", width: "360px", border: "1px solid #222222"
  },
  popupBtn: {
    width: "100%", padding: "12px", background: "#7c3aed",
    color: "#ffffff", border: "none", borderRadius: "10px",
    cursor: "pointer", marginBottom: "8px", fontWeight: "600"
  },
  popupSkip: {
    width: "100%", padding: "12px", background: "transparent",
    color: "#555555", border: "1px solid #222222", borderRadius: "10px",
    cursor: "pointer"
  },
  container: { maxWidth: "500px", margin: "0 auto", padding: "4rem 2rem" },
  header: { marginBottom: "2rem" },
  title: { color: "#ffffff", fontSize: "2rem", fontWeight: "700", marginBottom: "0.5rem" },
  subtitle: { color: "#555555", fontSize: "0.9rem" },
  card: { background: "#111111", borderRadius: "16px", padding: "2rem", border: "1px solid #222222" },
  label: { display: "block", color: "#a0a0a0", fontSize: "0.85rem", marginBottom: "8px" },
  input: {
    width: "100%", padding: "12px 16px", margin: "0 0 4px 0",
    borderRadius: "10px", border: "1px solid #222222",
    background: "#0a0a0a", color: "#ffffff", fontSize: "1rem",
    boxSizing: "border-box", outline: "none"
  },
  hint: { color: "#333333", fontSize: "0.75rem", display: "block", marginBottom: "20px" },
  button: {
    width: "100%", padding: "14px", background: "#7c3aed",
    color: "#ffffff", border: "none", borderRadius: "10px",
    cursor: "pointer", fontWeight: "600", marginTop: "1rem"
  },
  cancel: {
    width: "100%", padding: "14px", background: "transparent",
    color: "#555555", border: "1px solid #222222", borderRadius: "10px",
    cursor: "pointer", marginTop: "8px"
  },
  error: { color: "#ef4444", fontSize: "0.85rem", marginBottom: "1rem", padding: "10px", background: "#ef444410", borderRadius: "8px" },
  success: { color: "#22c55e", fontSize: "0.85rem", marginBottom: "1rem", padding: "10px", background: "#22c55e10", borderRadius: "8px" }
}