import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"
import BASE_URL from "../api.js"

export default function Dashboard() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    // Check active mode and redirect to seller dashboard if seller
    if (user?.activeMode === 'seller') {
      navigate("/seller-dashboard")
    }
  }, [])

  const switchToSeller = async () => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/auth/switch-mode`,
        { mode: "seller" },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      localStorage.setItem("user", JSON.stringify(data.user))
      navigate("/seller-dashboard")
    } catch (err) { console.log(err) }
  }

  const cards = [
    { icon: "🛍️", title: "Browse Shop", desc: "Explore all products", to: "/" },
    { icon: "👤", title: "My Profile", desc: "View and update your profile", to: "/profile" },
  ]

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.buyerBadge}>🛍️ Buyer Mode</div>
          <p style={styles.greeting}>Good day,</p>
          <h2 style={styles.name}>{user?.name}</h2>
          <p style={styles.email}>{user?.email}</p>
        </div>

        {/* Switch to Seller */}
        {user?.isSeller ? (
          <div style={styles.switchBar}>
            <div style={styles.switchInfo}>
              <span style={styles.switchIcon}>🏪</span>
              <div>
                <p style={styles.switchTitle}>Switch to Seller Mode</p>
                <p style={styles.switchSub}>{user?.shopName}</p>
              </div>
            </div>
            <button style={styles.switchBtn} onClick={switchToSeller}>
              Switch →
            </button>
          </div>
        ) : (
          <div style={styles.becomeSellerBar}>
            <div style={styles.switchInfo}>
              <span style={styles.switchIcon}>🏪</span>
              <div>
                <p style={styles.switchTitle}>Become a Seller</p>
                <p style={styles.switchSub}>Start selling your products on Vyorra</p>
              </div>
            </div>
            <button style={styles.becomeBtn}
              onClick={() => navigate("/become-seller")}>
              Get Started →
            </button>
          </div>
        )}

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
  header: { marginBottom: "2rem" },
  buyerBadge: {
    display: "inline-block", background: "#22c55e20",
    color: "#22c55e", padding: "4px 12px", borderRadius: "20px",
    fontSize: "0.8rem", marginBottom: "1rem", border: "1px solid #22c55e30"
  },
  greeting: { color: "#555555", fontSize: "0.9rem", letterSpacing: "2px", textTransform: "uppercase" },
  name: { color: "#ffffff", fontSize: "2.5rem", fontWeight: "700", margin: "0.25rem 0" },
  email: { color: "#555555", fontSize: "0.9rem" },
  switchBar: {
    background: "#111111", borderRadius: "12px", padding: "1rem 1.5rem",
    border: "1px solid #7c3aed30", display: "flex",
    justifyContent: "space-between", alignItems: "center",
    marginBottom: "2rem"
  },
  becomeSellerBar: {
    background: "linear-gradient(135deg, #7c3aed10, #a855f710)",
    borderRadius: "12px", padding: "1rem 1.5rem",
    border: "1px solid #7c3aed30", display: "flex",
    justifyContent: "space-between", alignItems: "center",
    marginBottom: "2rem"
  },
  switchInfo: { display: "flex", alignItems: "center", gap: "1rem" },
  switchIcon: { fontSize: "1.5rem" },
  switchTitle: { color: "#ffffff", fontWeight: "600", fontSize: "0.95rem", margin: 0 },
  switchSub: { color: "#555555", fontSize: "0.8rem", margin: 0 },
  switchBtn: {
    background: "#7c3aed", color: "#ffffff",
    border: "none", padding: "8px 16px",
    borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem",
    fontWeight: "600"
  },
  becomeBtn: {
    background: "#7c3aed", color: "#ffffff",
    border: "none", padding: "8px 16px",
    borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem",
    fontWeight: "600"
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