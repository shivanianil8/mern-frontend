import { Link, useNavigate } from "react-router-dom"

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
      <Link to="/" style={styles.logo}>Vyorra</Link>
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
    background: "#4f46e5", color: "white",
    position: "sticky", top: 0, zIndex: 100
  },
  logo: {
    color: "white", textDecoration: "none",
    fontSize: "1.5rem", fontWeight: "bold",
    letterSpacing: "2px"                    
  },
  links: { display: "flex", alignItems: "center", gap: "1rem" },
  link: { color: "white", textDecoration: "none", fontSize: "0.95rem" },
  welcome: { color: "#c7d2fe", fontSize: "0.9rem" },
  btn: {
    background: "white", color: "#4f46e5",
    border: "none", padding: "8px 16px",
    borderRadius: "6px", cursor: "pointer",
    fontWeight: "bold", textDecoration: "none",
    fontSize: "0.9rem"
  }
}