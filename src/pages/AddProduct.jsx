import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import BASE_URL from "../api.js"

export default function AddProduct() {
  const [form, setForm]           = useState({ name: "", price: "" })
  const [image, setImage]         = useState(null)
  const [preview, setPreview]     = useState(null)
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

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
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

    // Use FormData to send image + text together
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('price', form.price)
    if (image) formData.append('image', image)

    try {
      await axios.post(`${BASE_URL}/api/products`, formData,
        { headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
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

            {/* Image Upload */}
            <label style={styles.label}>Product Image (optional)</label>
            <div style={styles.imageUpload}
              onClick={() => document.getElementById('imageInput').click()}>
              {preview ? (
                <img src={preview} alt="preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }} />
              ) : (
                <div style={styles.uploadPlaceholder}>
                  <span style={{ fontSize: "2rem" }}>📷</span>
                  <p style={{ color: "#555555", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                    Click to upload image
                  </p>
                </div>
              )}
            </div>
            <input
              id="imageInput" type="file"
              accept="image/*" onChange={handleImage}
              style={{ display: "none" }}
            />

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
  imageUpload: {
    width: "100%", height: "200px", borderRadius: "10px",
    border: "2px dashed #222222", marginBottom: "20px",
    cursor: "pointer", overflow: "hidden",
    display: "flex", alignItems: "center", justifyContent: "center"
  },
  uploadPlaceholder: { textAlign: "center" },
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