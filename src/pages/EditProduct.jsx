import { useState } from "react"
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"
import Navbar from "../components/Navbar"
import BASE_URL from "../api.js"

export default function EditProduct() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const product   = location.state

  const [form, setForm] = useState({
    name:            product?.name || "",
    price:           product?.price || "",
    description:     product?.description || "",
    category:        product?.category || "Other",
    openToSwap:      product?.openToSwap || false,
    swapPreferences: product?.swapPreferences || "",
    rentAvailable:   product?.rentAvailable || false,
    rentPrice:       product?.rentPrice || "",
    rentPer:         product?.rentPer || "day"
  })

  const [error, setError]     = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (type === "checkbox") {
      setForm({ ...form, [name]: checked })
      return
    }

    if (name === "price" || name === "rentPrice") {
      const n = value.replace(/[^0-9]/g, "")
      if (n.length <= 7) setForm({ ...form, [name]: n })
      return
    }

    if (name === "name" && value.length > 100) return

    setForm({ ...form, [name]: value })
  }

  const validate = () => {
    if (form.name.trim().length < 2)
      return "Product name must be at least 2 characters"
    if (!form.price || Number(form.price) <= 0)
      return "Price must be greater than 0"
    if (form.description.trim().length < 10)
      return "Description must be at least 10 characters"
    if (form.rentAvailable && (!form.rentPrice || Number(form.rentPrice) <= 0))
      return "Rent price must be greater than 0"
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError("")

    const token = localStorage.getItem("token")

    try {
      await axios.put(
        `${BASE_URL}/api/products/${product._id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSuccess("Product updated!")
      setTimeout(() => navigate("/products"), 1500)
    } catch (err) {
      setError(err.response?.data?.message || "Failed")
    }
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Edit Product</h2>
          <p style={styles.subtitle}>Update your product details</p>
        </div>

        <div style={styles.card}>
          {error   && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <form onSubmit={handleSubmit}>

            {/* Product Name */}
            <label style={styles.label}>Product Name</label>
            <input style={styles.input} name="name"
              value={form.name} onChange={handleChange}
              maxLength={100} required />
            <small style={styles.hint}>{form.name.length}/100</small>

            {/* Price */}
            <label style={styles.label}>Price (₹)</label>
            <input style={styles.input} name="price"
              value={form.price} onChange={handleChange}
              inputMode="numeric" required />

            {/* Category */}
            <label style={styles.label}>Category</label>
            <select style={styles.input} name="category"
              value={form.category} onChange={handleChange}>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Food">Food</option>
              <option value="Books">Books</option>
              <option value="Furniture">Furniture</option>
              <option value="Sports">Sports</option>
              <option value="Beauty">Beauty</option>
              <option value="Other">Other</option>
            </select>

            {/* Open to Swap */}
            <label style={styles.checkboxWrap}>
              <input type="checkbox" name="openToSwap"
                checked={form.openToSwap} onChange={handleChange} />
              <span style={{ marginLeft: "8px" }}>Open to Swap</span>
            </label>

            {form.openToSwap && (
              <>
                <label style={styles.label}>Swap Preferences</label>
                <textarea
                  style={{ ...styles.input, minHeight: "80px", resize: "vertical" }}
                  name="swapPreferences"
                  value={form.swapPreferences}
                  onChange={handleChange}
                  placeholder="What would you like in exchange?"
                />
              </>
            )}

            {/* Available for Rent */}
            <label style={styles.checkboxWrap}>
              <input type="checkbox" name="rentAvailable"
                checked={form.rentAvailable} onChange={handleChange} />
              <span style={{ marginLeft: "8px" }}>Available for Rent</span>
            </label>

            {form.rentAvailable && (
              <>
                <label style={styles.label}>Rent Price (₹)</label>
                <input style={styles.input} name="rentPrice"
                  placeholder="Enter rent price"
                  value={form.rentPrice} onChange={handleChange}
                  inputMode="numeric" />

                <label style={styles.label}>Rent Per</label>
                <select style={styles.input} name="rentPer"
                  value={form.rentPer} onChange={handleChange}>
                  <option value="day">Per Day</option>
                  <option value="week">Per Week</option>
                </select>
              </>
            )}

            {/* Description */}
            <label style={styles.label}>Description</label>
            <textarea
              style={{ ...styles.input, minHeight: "120px", resize: "vertical" }}
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
            <small style={styles.hint}>{form.description.length} characters</small>

            <button style={styles.button} type="submit">Save Changes</button>
            <button style={styles.cancel} type="button" onClick={() => navigate("/products")}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: "500px", margin: "0 auto", padding: "4rem 2rem" },
  header: { marginBottom: "2rem" },
  title: { color: "#ffffff", fontSize: "2rem", fontWeight: "700", marginBottom: "0.5rem" },
  subtitle: { color: "#555555", fontSize: "0.9rem" },
  card: { background: "#111111", borderRadius: "16px", padding: "2rem", border: "1px solid #222222" },
  label: { display: "block", color: "#a0a0a0", fontSize: "0.85rem", marginBottom: "8px" },
  checkboxWrap: {
    display: "flex", alignItems: "center",
    color: "#ffffff", marginBottom: "20px"
  },
  input: {
    width: "100%", padding: "12px 16px", margin: "0 0 12px 0",
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
    color: "#555555", border: "1px solid #222222",
    borderRadius: "10px", cursor: "pointer", marginTop: "8px"
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