import { useState } from "react"
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function EditProduct() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const product   = location.state

  const [form, setForm]   = useState({
    name:  product?.name  || "",
    price: product?.price || ""
  })
  const [error,   setError]   = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "price") {
      const numbersOnly = value.replace(/[^0-9]/g, "")
      if (numbersOnly.length <= 7) {
        setForm({ ...form, price: numbersOnly })
      }
      return
    }

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
    const token = localStorage.getItem("token")
    try {
      await axios.put(
        `http://localhost:5000/api/products/${product._id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSuccess("Product updated!")
      setTimeout(() => navigate("/products"), 1500)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update")
    }
  }

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>Edit Product</h2>
          {error   && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}
          <form onSubmit={handleSubmit}>
            <label style={styles.label}>
              Product Name (max 100 characters)
            </label>
            <input style={styles.input} name="name"
              value={form.name} onChange={handleChange}
              maxLength={100} required />
            <small style={styles.hint}>
              {form.name.length}/100 characters
            </small>

            <label style={styles.label}>Price (₹)</label>
            <input style={styles.input} name="price"
              value={form.price} onChange={handleChange}
              inputMode="numeric" required />
            <small style={styles.hint}>Numbers only</small>

            <button style={styles.button} type="submit">
              Save Changes
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