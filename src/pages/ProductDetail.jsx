import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"
import BASE_URL from "../api.js"

export default function ProductDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const token        = localStorage.getItem("token")

  const [product, setProduct]           = useState(null)
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState("")
  const [rentDuration, setRentDuration] = useState(1)
  const [rentSuccess, setRentSuccess]   = useState("")
  const [rentError, setRentError]       = useState("")
  const [cartMsg, setCartMsg]           = useState("")

  useEffect(() => { fetchProduct() }, [id])

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/products/${id}`)
      setProduct(data.product)
    } catch (err) {
      setError("Product not found")
    } finally {
      setLoading(false)
    }
  }

  const handleRent = async () => {
    if (!token) { navigate("/login"); return }
    setRentError("")
    try {
      await axios.post(
        `${BASE_URL}/api/rentals`,
        { productId: product._id, duration: rentDuration },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setRentSuccess("Rental confirmed! Redirecting...")
      setTimeout(() => navigate("/my-rentals"), 1500)
    } catch (err) {
      setRentError(err.response?.data?.message || "Failed to rent")
    }
  }

  const handleAddToCart = () => {
    if (!token) { navigate("/login"); return }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    const exists = cart.find(item => item.productId === product._id)

    if (exists) {
      const updated = cart.map(item =>
        item.productId === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
      localStorage.setItem("cart", JSON.stringify(updated))
    } else {
      cart.push({
        productId: product._id,
        name:      product.name,
        price:     product.price,
        image:     product.image,
        quantity:  1
      })
      localStorage.setItem("cart", JSON.stringify(cart))
    }

    setCartMsg("Added to cart!")
    setTimeout(() => setCartMsg(""), 2000)
  }

  if (loading) {
    return (
      <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
        <Navbar />
        <div style={styles.center}>
          <h2 style={{ color: "#ffffff" }}>Loading...</h2>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
        <Navbar />
        <div style={styles.center}>
          <h2 style={{ color: "#ffffff" }}>Product not found</h2>
          <button style={styles.backBtn} onClick={() => navigate("/")}>
            Back Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.card}>

          {/* Image */}
          <div style={styles.imageSection}>
            {product.image ? (
              <img src={product.image} alt={product.name} style={styles.image} />
            ) : (
              <div style={styles.placeholder}>🛍️</div>
            )}
          </div>

          {/* Details */}
          <div style={styles.content}>
            <span style={styles.category}>{product.category}</span>

            <h1 style={styles.title}>{product.name}</h1>

            <p style={styles.price}>₹{product.price}</p>

            <div style={styles.seller}>
              Seller: {product.addedBy?.name || "Unknown"}
            </div>

            {/* Add to Cart */}
            {cartMsg && <p style={styles.cartMsg}>{cartMsg}</p>}
            <div style={styles.cartRow}>
              <button style={styles.cartBtn} onClick={handleAddToCart}>
                🛒 Add to Cart
              </button>
              <button style={styles.viewCartBtn} onClick={() => navigate("/cart")}>
                View Cart
              </button>
            </div>

            {/* Description Box */}
            <div style={styles.descriptionBox}>
              <h3 style={styles.descriptionTitle}>Description</h3>
              <p style={styles.description}>{product.description}</p>

              {/* Swap Info */}
              {product.openToSwap && (
                <div style={styles.swapBox}>
                  <h4 style={{ color: "#ffffff" }}>🔄 Open To Swap</h4>
                  <p style={{ color: "#a0a0a0" }}>
                    {product.swapPreferences || "No preferences specified"}
                  </p>
                </div>
              )}
            </div>

            {/* Rent Box */}
            {product.rentAvailable && (
              <div style={styles.rentBox}>
                <h3 style={styles.rentTitle}>🏠 Available for Rent</h3>
                <p style={styles.rentPrice}>
                  ₹{product.rentPrice} / {product.rentPer}
                </p>

                {rentError   && <p style={styles.rentError}>{rentError}</p>}
                {rentSuccess && <p style={styles.rentSuccessMsg}>{rentSuccess}</p>}

                <div style={styles.rentForm}>
                  <label style={styles.rentLabel}>
                    Duration ({product.rentPer}s)
                  </label>
                  <input
                    style={styles.rentInput}
                    type="number"
                    min="1"
                    value={rentDuration}
                    onChange={(e) => setRentDuration(Number(e.target.value))}
                    placeholder={`Enter number of ${product.rentPer}s`}
                  />

                  {rentDuration > 0 && (
                    <p style={styles.totalCost}>
                      Total: ₹{product.rentPrice * rentDuration}
                    </p>
                  )}

                  <button style={styles.rentBtn} onClick={handleRent}>
                    🏠 Rent Now
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {product.openToSwap && (
                <button
                  style={styles.swapBtn}
                  onClick={() => navigate(`/propose-swap/${product._id}`)}
                >
                  🔄 Propose Swap
                </button>
              )}

              <button style={styles.backBtn} onClick={() => navigate(-1)}>
                ← Back
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: "1200px", margin: "0 auto", padding: "3rem 2rem" },
  center: {
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    minHeight: "70vh", gap: "1rem"
  },
  card: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: "3rem", background: "#111111",
    border: "1px solid #222222", borderRadius: "20px", padding: "2rem"
  },
  imageSection: { width: "100%" },
  image: { width: "100%", height: "500px", objectFit: "cover", borderRadius: "16px" },
  placeholder: {
    height: "500px", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "6rem",
    background: "#1a1a1a", borderRadius: "16px"
  },
  content: { display: "flex", flexDirection: "column" },
  category: { color: "#7c3aed", fontSize: "0.9rem", marginBottom: "1rem" },
  title: { color: "#ffffff", fontSize: "2.5rem", fontWeight: "700", marginBottom: "1rem" },
  price: { color: "#7c3aed", fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem" },
  seller: { color: "#888888", marginBottom: "1rem" },
  cartMsg: {
    color: "#22c55e", fontSize: "0.85rem", marginBottom: "0.5rem",
    padding: "8px", background: "#22c55e10", borderRadius: "8px"
  },
  cartRow: { display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" },
  cartBtn: {
    background: "#7c3aed", color: "#ffffff", border: "none",
    padding: "12px 24px", borderRadius: "10px",
    cursor: "pointer", fontWeight: "600", fontSize: "1rem"
  },
  viewCartBtn: {
    background: "transparent", color: "#a0a0a0",
    border: "1px solid #333333", padding: "12px 24px",
    borderRadius: "10px", cursor: "pointer", fontWeight: "600"
  },
  descriptionBox: {
    background: "#0a0a0a", border: "1px solid #222222",
    borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem"
  },
  descriptionTitle: { color: "#ffffff", marginBottom: "1rem" },
  description: { color: "#b0b0b0", lineHeight: "1.7" },
  swapBox: {
    marginTop: "1rem", padding: "1rem",
    border: "1px solid #22c55e30", borderRadius: "10px",
    background: "#22c55e10"
  },
  rentBox: {
    background: "#0a0a0a", border: "1px solid #7c3aed30",
    borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem"
  },
  rentTitle: { color: "#ffffff", marginBottom: "0.5rem", fontSize: "1.1rem" },
  rentPrice: { color: "#7c3aed", fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" },
  rentForm: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  rentLabel: { color: "#a0a0a0", fontSize: "0.85rem" },
  rentInput: {
    padding: "10px 16px", borderRadius: "10px",
    border: "1px solid #222222", background: "#111111",
    color: "#ffffff", fontSize: "1rem", outline: "none"
  },
  totalCost: { color: "#22c55e", fontWeight: "700", fontSize: "1.1rem" },
  rentBtn: {
    background: "#22c55e", color: "#ffffff", border: "none",
    padding: "12px 20px", borderRadius: "10px",
    cursor: "pointer", fontWeight: "600", width: "fit-content"
  },
  rentError: {
    color: "#ef4444", fontSize: "0.85rem",
    padding: "8px", background: "#ef444410", borderRadius: "8px"
  },
  rentSuccessMsg: {
    color: "#22c55e", fontSize: "0.85rem",
    padding: "8px", background: "#22c55e10", borderRadius: "8px"
  },
  swapBtn: {
    background: "#22c55e", color: "#ffffff", border: "none",
    padding: "12px 20px", borderRadius: "10px",
    cursor: "pointer", fontWeight: "600"
  },
  backBtn: {
    background: "#7c3aed", color: "#ffffff", border: "none",
    padding: "12px 20px", borderRadius: "10px",
    cursor: "pointer", fontWeight: "600", width: "fit-content"
  }
}