import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"))

  const cards = [
    { icon: "➕", title: "Add Product", desc: "List a new product for sale", to: "/add-product" },
    { icon: "📦", title: "My Products", desc: "Manage your listed products", to: "/products" },
    { icon: "👤", title: "My Profile", desc: "View and update your profile", to: "/profile" },
    { icon: "🛍️", title: "Browse Shop", desc: "Explore all products", to: "/" },
  ]

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <p style={styles.greeting}>Good day,</p>
          <h2 style={styles.name}>{user?.name}</h2>
          <p style={styles.email}>{user?.email}</p>
        </div>

        <div style={styles.grid}>
          {cards.map((card, i) => (
            <Link to={card.to} key={i} style={styles.card}>
              <div style={styles.icon}>{card.icon}</div>
              <h3 style={styles.cardTitle}>{card.title}</h3>
              <p style={styles.cardDesc}>{card.desc}</p>
              <span style={styles.arrow}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: "900px", margin: "0 auto", padding: "4rem 2rem" },
  header: { marginBottom: "3rem" },
  greeting: { color: "#555555", fontSize: "0.9rem", letterSpacing: "2px", textTransform: "uppercase" },
  name: { color: "#ffffff", fontSize: "2.5rem", fontWeight: "700", margin: "0.25rem 0" },
  email: { color: "#555555", fontSize: "0.9rem" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "1rem"
  },
  card: {
    background: "#111111", borderRadius: "16px",
    padding: "1.5rem", border: "1px solid #222222",
    textDecoration: "none", color: "#ffffff",
    display: "flex", flexDirection: "column",
    transition: "border-color 0.2s"
  },
  icon: { fontSize: "2rem", marginBottom: "1rem" },
  cardTitle: { color: "#ffffff", fontWeight: "600", marginBottom: "0.5rem", fontSize: "1rem" },
  cardDesc: { color: "#555555", fontSize: "0.85rem", flex: 1, lineHeight: 1.5 },
  arrow: { color: "#7c3aed", marginTop: "1.5rem", fontSize: "1.2rem" }
}