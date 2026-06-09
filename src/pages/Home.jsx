import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"

export default function Home() {
  const [products, setProducts] = useState([])
  const token = localStorage.getItem("token")

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(({ data }) => setProducts(data.products))
      .catch(err => console.log(err))
  }, [])

  return (
    <div>
      <Navbar />

      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Vyorra</h1>
        <p style={styles.heroTagline}>Shop beyond ordinary</p>
        <p style={styles.heroText}>
          Discover unique products from sellers around you
        </p>

        {!token && (
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Link to="/signup" style={styles.heroBtn}>Get Started</Link>
            <Link to="/login"  style={styles.heroBtnOutline}>Login</Link>
          </div>
        )}

        {token && (
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Link to="/add-product" style={styles.heroBtn}>Add Product</Link>
            <Link to="/products"    style={styles.heroBtnOutline}>My Products</Link>
          </div>
        )}
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>All Products</h2>
        {products.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>
            No products yet. Be the first to add one!
          </p>
        ) : (
          <div style={styles.grid}>
            {products.map(product => (
              <div key={product._id} style={styles.card}>
                <div style={styles.cardIcon}>🛍️</div>
                <h3 style={styles.cardName}>{product.name}</h3>
                <p style={styles.cardPrice}>₹{product.price}</p>
                <p style={styles.cardSeller}>
                  Added by {product.addedBy?.name || "Unknown"}
                </p>
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
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "white", textAlign: "center", padding: "5rem 2rem"
  },
  heroTitle: {
    fontSize: "4rem", marginBottom: "0.5rem",
    letterSpacing: "4px", fontWeight: "bold"
  },
  heroTagline: {
    fontSize: "1.1rem", marginBottom: "1rem",
    opacity: 0.8, letterSpacing: "2px",
    textTransform: "uppercase"
  },
  heroText: {
    fontSize: "1.1rem", marginBottom: "2rem", opacity: 0.9
  },
  heroBtn: {
    background: "white", color: "#4f46e5",
    padding: "12px 28px", borderRadius: "8px",
    textDecoration: "none", fontWeight: "bold"
  },
  heroBtnOutline: {
    background: "transparent", color: "white",
    padding: "12px 28px", borderRadius: "8px",
    textDecoration: "none", fontWeight: "bold",
    border: "2px solid white"
  },
  section:      { padding: "3rem 2rem", maxWidth: "1200px", margin: "0 auto" },
  sectionTitle: { textAlign: "center", marginBottom: "2rem", fontSize: "1.8rem" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "1.5rem"
  },
  card: {
    background: "white", borderRadius: "12px",
    padding: "1.5rem", textAlign: "center",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    border: "1px solid #f0f0f0"
  },
  cardIcon:   { fontSize: "3rem", marginBottom: "0.5rem" },
  cardName:   { fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem" },
  cardPrice:  { fontSize: "1.3rem", color: "#4f46e5", fontWeight: "bold" },
  cardSeller: { fontSize: "0.8rem", color: "#888", marginTop: "0.5rem" }
}