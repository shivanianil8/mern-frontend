import { Link, useNavigate } from "react-router-dom"
import { theme as t } from "../theme"

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        <span style={styles.logoText}>Vyorra</span>
      </Link>

      <div style={styles.links}>
        {token ? (
          <>
            <span style={styles.welcome}>Hi, {user?.name}</span>
            <Link to="/dashboard"   style={styles.link}>Dashboard</Link>
            <Link to="/profile"     style={styles.link}>Profile</Link>
            <Link to="/products"    style={styles.link}>My Products</Link>
            <Link to="/add-product" style={styles.link}>Add Product</Link>
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"  style={styles.link}>Login</Link>
            <Link to="/signup" style={styles.btn}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", padding: "1rem 2rem",
    background: "#0a0a0a",
    borderBottom: "1px solid #222222",
    position: "sticky", top: 0, zIndex: 100,
    backdropFilter: "blur(10px)"
  },
  logo: { textDecoration: "none" },
  logoText: {
    color: "#ffffff", fontSize: "1.5rem",
    fontWeight: "700", letterSpacing: "3px",
    textTransform: "uppercase"
  },
  links: { display: "flex", alignItems: "center", gap: "1.5rem" },
  link: {
    color: "#a0a0a0", textDecoration: "none",
    fontSize: "0.9rem", transition: "color 0.2s",
    letterSpacing: "0.5px"
  },
  welcome: { color: "#555555", fontSize: "0.85rem" },
  btn: {
    background: "#7c3aed", color: "#ffffff",
    border: "none", padding: "8px 20px",
    borderRadius: "8px", cursor: "pointer",
    fontWeight: "600", textDecoration: "none",
    fontSize: "0.9rem", letterSpacing: "0.5px"
  }
}