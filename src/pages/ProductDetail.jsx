import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"
import BASE_URL from "../api.js"

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/products/${id}`
      )

      setProduct(data)
    } catch (err) {
      setError("Product not found")
    } finally {
      setLoading(false)
    }
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
          <h2 style={{ color: "#ffffff" }}>
            Product not found
          </h2>

          <button
            style={styles.backBtn}
            onClick={() => navigate("/")}
          >
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

          <div style={styles.imageSection}>
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                style={styles.image}
              />
            ) : (
              <div style={styles.placeholder}>
                🛍️
              </div>
            )}
          </div>

          <div style={styles.content}>
            <span style={styles.category}>
              {product.category}
            </span>

            <h1 style={styles.title}>
              {product.name}
            </h1>

            <p style={styles.price}>
              ₹{product.price}
            </p>

            <div style={styles.seller}>
              Seller: {product.addedBy?.name || "Unknown"}
            </div>

            <div style={styles.descriptionBox}>
              <h3 style={styles.descriptionTitle}>
                Description
              </h3>

              <p style={styles.description}>
                {product.description}
              </p>
            </div>

            <button
              style={styles.backBtn}
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "3rem 2rem"
  },

  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "70vh",
    gap: "1rem"
  },

  card: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "3rem",
    background: "#111111",
    border: "1px solid #222222",
    borderRadius: "20px",
    padding: "2rem"
  },

  imageSection: {
    width: "100%"
  },

  image: {
    width: "100%",
    height: "500px",
    objectFit: "cover",
    borderRadius: "16px"
  },

  placeholder: {
    height: "500px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "6rem",
    background: "#1a1a1a",
    borderRadius: "16px"
  },

  content: {
    display: "flex",
    flexDirection: "column"
  },

  category: {
    color: "#7c3aed",
    fontSize: "0.9rem",
    marginBottom: "1rem"
  },

  title: {
    color: "#ffffff",
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "1rem"
  },

  price: {
    color: "#7c3aed",
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "1.5rem"
  },

  seller: {
    color: "#888888",
    marginBottom: "2rem"
  },

  descriptionBox: {
    background: "#0a0a0a",
    border: "1px solid #222222",
    borderRadius: "12px",
    padding: "1.5rem",
    marginBottom: "2rem"
  },

  descriptionTitle: {
    color: "#ffffff",
    marginBottom: "1rem"
  },

  description: {
    color: "#b0b0b0",
    lineHeight: "1.7"
  },

  backBtn: {
    background: "#7c3aed",
    color: "#ffffff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    width: "fit-content"
  }
}