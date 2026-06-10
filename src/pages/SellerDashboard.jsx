import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"
import BASE_URL from "../api.js"

export default function SellerDashboard() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const switchToBuyer = async () => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/auth/switch-mode`,
        { mode: "buyer" },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      localStorage.setItem("user", JSON.stringify(data.user))
      navigate("/dashboard")
    } catch (err) { console.log(err) }
  }

  const cards = [
    { icon: "➕", title: "Add Product", desc: "List a new product", to: "/add-product" },
    { icon: "📦", title: "My Products", desc: "Manage your listings", to: "/products" },
    { icon: "👤", title: "Shop Profile", desc: "Edit your shop details", to: "/profile" },
    { icon: "🛍️", title: "Browse Shop", desc: "See all products", to: "/" },
  ]

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />
      <div style={styles.container}>

        {/* Shop Header */}
        <div style={styles.shopHeader}>
          <div style={styles.shopLogoWrap}>
            {user?.shopLogo ? (
              <img src={user.shopLogo} alt="shop" style={styles.shopLogo} />
            ) : (
              <div style={styles.shopLogoPlaceholder}>
                {user?.shopName?.charAt(0)?.toUpperCase() || "S"}
              </div>
            )}
          </div>
          <div>
            <div style={styles.sellerBadge}>🏪 Seller Mode</div>
            <h2 style={styles.shopName}>{user?.shopName}</h2>
            <p style={styles.shopDesc}>{user?.shopDescription}</p>
          </div>
        </div>

        {/* Switch to Buyer */}
        <div style={styles.switchBar}>
          <div style={styles.switchInfo}>
            <span style={styles.switchIcon}>👤</span>
            <div>
              <p style={styles.switchTitle}>Switch to Buyer Mode</p>
              <p style={styles.switchSub}>Browse and shop products</p>
            </div>
          </div>
          <button style={styles.switchBtn} onClick={switchToBuyer}>
            Switch →
          </button>
        </div>

        {/* Cards */}
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
  shopHeader: { display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" },
  shopLogoWrap: { flexShrink: 0 },
  shopLogo: { width: "80px", height: "80px", borderRadius: "16px", objectFit: "cover" },
  shopLogoPlaceholder: {
    width: "80px", height: "80px", borderRadius: "16px",
    background: "#7c3aed20", border: "1px solid #7c3aed30",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "2rem", fontWeight: "700", color: "#7c3aed"
  },
  sellerBadge: {
    display: "inline-block", background: "#7c3aed20",
    color: "#a855f7", padding: "4px 12px", borderRadius: "20px",
    fontSize: "0.8rem", marginBottom: "0.5rem", border: "1px solid #7c3aed30"
  },
  shopName: { color: "#ffffff", fontSize: "1.8rem", fontWeight: "700", margin: "0 0 0.25rem" },
  shopDesc: { color: "#555555", fontSize: "0.9rem" },
  switchBar: {
    background: "#111111", borderRadius: "12px", padding: "1rem 1.5rem",
    border: "1px solid #222222", display: "flex",
    justifyContent: "space-between", alignItems: "center",
    marginBottom: "2rem"
  },
  switchInfo: { display: "flex", alignItems: "center", gap: "1rem" },
  switchIcon: { fontSize: "1.5rem" },
  switchTitle: { color: "#ffffff", fontWeight: "600", fontSize: "0.95rem", margin: 0 },
  switchSub: { color: "#555555", fontSize: "0.8rem", margin: 0 },
  switchBtn: {
    background: "#1a1a1a", color: "#a0a0a0",
    border: "1px solid #333333", padding: "8px 16px",
    borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "1rem"
  },
  card: {
    background: "#111111", borderRadius: "16px", padding: "1.5rem",
    border: "1px solid #222222", textDecoration: "none",
    color: "#ffffff", display: "flex", flexDirection: "column"
  },
  icon: { fontSize: "2rem", marginBottom: "1rem" },
  cardTitle: { color: "#ffffff", fontWeight: "600", marginBottom: "0.5rem", fontSize: "1rem" },
  cardDesc: { color: "#555555", fontSize: "0.85rem", flex: 1, lineHeight: 1.5 },
  arrow: { color: "#7c3aed", marginTop: "1.5rem", fontSize: "1.2rem" }
}