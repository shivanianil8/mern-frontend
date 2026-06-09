import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"))

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2>Welcome back, {user?.name}!</h2>
        <p style={{ color: "#888" }}>{user?.email}</p>

        <div style={styles.cards}>
          <Link to="/add-product" style={styles.card}>
            <div style={styles.icon}>➕</div>
            <h3>Add Product</h3>
            <p>List a new product for sale</p>
          </Link>

          <Link to="/products" style={styles.card}>
            <div style={styles.icon}>📦</div>
            <h3>My Products</h3>
            <p>View, edit or delete your products</p>
          </Link>

          <Link to="/profile" style={styles.card}>
            <div style={styles.icon}>👤</div>
            <h3>My Profile</h3>
            <p>View and update your profile</p>
          </Link>

          <Link to="/" style={styles.card}>
            <div style={styles.icon}>🛍️</div>
            <h3>Browse Shop</h3>
            <p>See all available products</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: "900px", margin: "3rem auto", padding: "0 2rem" },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "1.5rem", marginTop: "2rem"
  },
  card: {
    background: "white", borderRadius: "12px",
    padding: "2rem", textAlign: "center",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    textDecoration: "none", color: "#333",
    border: "1px solid #f0f0f0"
  },
  icon: { fontSize: "2.5rem", marginBottom: "1rem" }
}