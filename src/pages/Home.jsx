import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"
import BASE_URL from "../api.js"

export default function Home() {
  const [products, setProducts] = useState([])
  const token = localStorage.getItem("token")

  useEffect(() => {
    axios.get(`${BASE_URL}/api/products`)
      .then(({ data }) => setProducts(data.products))
      .catch(err => console.log(err))
  }, [])

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <p style={styles.heroTag}>— Premium Marketplace</p>
          <h1 style={styles.heroTitle}>
            Shop Beyond<br />
            <span style={styles.heroAccent}>Ordinary</span>
          </h1>
          <p style={styles.heroText}>
            Discover unique products from verified sellers around you.
            Buy, sell and trade with confidence.
          </p>
          {!token ? (
            <div style={styles.heroBtns}>
              <Link to="/signup" style={styles.heroBtn}>Get Started</Link>
              <Link to="/login"  style={styles.heroBtnOutline}>Login</Link>
            </div>
          ) : (
            <div style={styles.heroBtns}>
              <Link to="/add-product" style={styles.heroBtn}>Add Product</Link>
              <Link to="/products"    style={styles.heroBtnOutline}>My Products</Link>
            </div>
          )}
        </div>

        <div style={styles.circle1} />
        <div style={styles.circle2} />
      </div>

      {/* Products */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>All Products</h2>
          <p style={styles.sectionSub}>Explore what sellers have listed</p>
        </div>

        {products.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ fontSize: "3rem" }}>🛍️</p>
            <p style={{ color: "#555" }}>No products yet. Be the first to add one!</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {products.map(product => (
              <div key={product._id} style={styles.card}>

                {/* Image or placeholder */}
                {product.image ? (
                  <img
                    src={`${BASE_URL}${product.image}`}
                    alt={product.name}
                    style={styles.cardImage}
                  />
                ) : (
                  <div style={styles.cardImagePlaceholder}>
                    <span style={{ fontSize: "3rem" }}>🛍️</span>
                  </div>
                )}

                <div style={styles.cardBody}>
                  <h3 style={styles.cardName}>{product.name}</h3>
                  <p style={styles.cardPrice}>₹{product.price}</p>
                  <div style={styles.cardFooter}>
                    <span style={styles.cardSeller}>
                      by {product.addedBy?.name || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  hero: {
    position: "relative", overflow: "hidden",
    padding: "8rem 2rem", textAlign: "center",
    background: "#0a0a0a"
  },
  heroContent: { position: "relative", zIndex: 2 },
  heroTag: {
    color: "#7c3aed", fontSize: "0.85rem",
    letterSpacing: "3px", textTransform: "uppercase",
    marginBottom: "1.5rem"
  },
  heroTitle: {
    fontSize: "4.5rem", fontWeight: "800",
    color: "#ffffff", lineHeight: 1.1,
    marginBottom: "1.5rem", letterSpacing: "-1px"
  },
  heroAccent: {
    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  heroText: {
    color: "#a0a0a0", fontSize: "1.1rem",
    maxWidth: "500px", margin: "0 auto 2.5rem",
    lineHeight: 1.7
  },
  heroBtns: {
    display: "flex", gap: "1rem",
    justifyContent: "center", flexWrap: "wrap"
  },
  heroBtn: {
    background: "#7c3aed", color: "#ffffff",
    padding: "14px 32px", borderRadius: "10px",
    textDecoration: "none", fontWeight: "600",
    fontSize: "0.95rem", letterSpacing: "0.5px"
  },
  heroBtnOutline: {
    background: "transparent", color: "#ffffff",
    padding: "14px 32px", borderRadius: "10px",
    textDecoration: "none", fontWeight: "600",
    border: "1px solid #333333", fontSize: "0.95rem"
  },
  circle1: {
    position: "absolute", width: "500px", height: "500px",
    borderRadius: "50%", top: "-200px", right: "-100px",
    background: "radial-gradient(circle, #7c3aed15, transparent)",
    zIndex: 1
  },
  circle2: {
    position: "absolute", width: "400px", height: "400px",
    borderRadius: "50%", bottom: "-150px", left: "-100px",
    background: "radial-gradient(circle, #a855f715, transparent)",
    zIndex: 1
  },
  section: {
    maxWidth: "1200px", margin: "0 auto",
    padding: "5rem 2rem"
  },
  sectionHeader: { textAlign: "center", marginBottom: "3rem" },
  sectionTitle: {
    color: "#ffffff", fontSize: "2rem",
    fontWeight: "700", marginBottom: "0.5rem"
  },
  sectionSub: { color: "#555555", fontSize: "0.95rem" },
  empty: { textAlign: "center", padding: "4rem" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "1.5rem"
  },
  card: {
    background: "#111111", borderRadius: "16px",
    border: "1px solid #222222",
    overflow: "hidden", cursor: "pointer",
    transition: "border-color 0.2s, transform 0.2s"
  },
  cardImage: {
    width: "100%", height: "180px",
    objectFit: "cover"
  },
  cardImagePlaceholder: {
    width: "100%", height: "180px",
    background: "#1a1a1a",
    display: "flex", alignItems: "center",
    justifyContent: "center"
  },
  cardBody: { padding: "1.25rem" },
  cardName: {
    color: "#ffffff", fontSize: "1rem",
    fontWeight: "600", marginBottom: "0.5rem"
  },
  cardPrice: {
    color: "#7c3aed", fontSize: "1.3rem",
    fontWeight: "700", marginBottom: "0.75rem"
  },
  cardFooter: {
    borderTop: "1px solid #1a1a1a", paddingTop: "0.75rem"
  },
  cardSeller: { color: "#555555", fontSize: "0.8rem" }
}