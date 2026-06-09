import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

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
        "http://localhost:5000/api/auth/profile",
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!data.user.isProfileComplete) setShowPopup(true)
    } catch (err) { console.log(err) }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    // Price — only positive numbers, max 7 digits
    if (name === "price") {
      const numbersOnly = value.replace(/[^0-9]/g, "")
      if (numbersOnly.length <= 7) {
        setForm({ ...form, price: numbersOnly })
      }
      return
    }

    // Name — max 100 characters
    if (name === "name" && value.length > 100) return

    setForm({ ...form, [name]: value })
  }

  const validate = () => {
    if (form.name.trim().length < 2) {
      return "Product name must be at least 2 characters"
    }
    if (!form.price || Number(form.price) <= 0) {
      return "Price must be greater than 0"
    }
    if (Number(form.price) > 9999999) {
      return "Price is too high"
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setError("")
    try {
      await axios.post(
        "http://localhost:5000/api/products",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSuccess("Product added successfully!")
      setTimeout(() => navigate("/products"), 1500)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product")
    }
  }

  return (
    <div>
      <Navbar />

      {showPopup && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👤</div>
            <h3 style={{ marginBottom: "0.5rem" }}>Complete Your Profile</h3>
            <p style={{ color: "#888", marginBottom: "1.5rem" }}>
              Please complete your profile before adding products.
              Add your phone number and address to continue.
            </p>
            <button style={styles.goToProfile}
              onClick={() => navigate("/profile")}>
              Complete Profile
            </button>
            <button style={styles.skipBtn}
              onClick={() => setShowPopup(false)}>
              Skip for now
            </button>
          </div>
        </div>
      )}

      <div style={styles.container}>
        <div style={styles.card}>
          <h2>Add New Product</h2>
          {error   && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}
          <form onSubmit={handleSubmit}>
            <label style={styles.label}>
              Product Name (max 100 characters)
            </label>
            <input style={styles.input} name="name"
              placeholder="Enter product name"
              value={form.name} onChange={handleChange}
              maxLength={100} required />
            <small style={styles.hint}>
              {form.name.length}/100 characters
            </small>

            <label style={styles.label}>Price (₹)</label>
            <input style={styles.input} name="price"
              placeholder="Enter price"
              value={form.price} onChange={handleChange}
              inputMode="numeric" required />
            <small style={styles.hint}>
              Numbers only, max ₹99,99,999
            </small>

            <button style={styles.button} type="submit">
              Add Product
            </button>
            <button style={styles.cancel} type="button"
              onClick={() => navigate("/products")}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: "fixed", top: 0, left: 0,
    width: "100%", height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex", justifyContent: "center",
    alignItems: "center", zIndex: 999
  },
  popup: {
    background: "white", padding: "2.5rem",
    borderRadius: "16px", textAlign: "center",
    width: "360px", boxShadow: "0 4px 30px rgba(0,0,0,0.2)"
  },
  goToProfile: {
    width: "100%", padding: "10px", background: "#4f46e5",
    color: "white", border: "none", borderRadius: "8px",
    cursor: "pointer", marginBottom: "8px",
    fontSize: "1rem", fontWeight: "bold"
  },
  skipBtn: {
    width: "100%", padding: "10px", background: "#f0f0f0",
    color: "#888", border: "none", borderRadius: "8px",
    cursor: "pointer", fontSize: "1rem"
  },
  container: {
    display: "flex", justifyContent: "center",
    alignItems: "center", minHeight: "80vh", background: "#f0f2f5"
  },
  card: {
    background: "white", padding: "2rem", borderRadius: "12px",
    width: "400px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
  },
  label: {
    display: "block", marginBottom: "4px",
    fontWeight: "500", color: "#555"
  },
  input: {
    width: "100%", padding: "10px", margin: "0 0 4px 0",
    borderRadius: "6px", border: "1px solid #ccc",
    boxSizing: "border-box", fontSize: "1rem"
  },
  hint: {
    color: "#aaa", fontSize: "0.75rem",
    display: "block", marginBottom: "16px"
  },
  button: {
    width: "100%", padding: "10px", background: "#4f46e5",
    color: "white", border: "none", borderRadius: "6px",
    cursor: "pointer", marginBottom: "8px",
    marginTop: "1rem", fontSize: "1rem"
  },
  cancel: {
    width: "100%", padding: "10px", background: "#f0f0f0",
    color: "#333", border: "none", borderRadius: "6px",
    cursor: "pointer", fontSize: "1rem"
  },
  error:   { color: "red", marginBottom: "10px" },
  success: { color: "green", marginBottom: "10px" }
}