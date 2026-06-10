import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../App.css"

export default function Navbar() {
  const navigate        = useNavigate()
  const token           = localStorage.getItem("token")
  const user            = JSON.parse(localStorage.getItem("user"))
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
    setOpen(false)
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>Vyorra</Link>

      {/* Desktop Links */}
      <div className="desktop-links">
        {token ? (
          <>
            <span style={styles.welcome}>Hi, {user?.name}</span>

            <Link to="/" style={styles.link}>Home</Link>

            <Link to="/products" style={styles.link}>My Products</Link>

            <Link to="/add-product" style={styles.link}>Add Product</Link>

            {user?.isSeller ? (
              <>
                <Link to="/seller-dashboard" style={styles.link}>Seller Dashboard</Link>
                <Link to="/profile" style={styles.link}>Seller Profile</Link>
              </>
            ) : (
              <>
                <Link to="/profile" style={styles.link}>Profile</Link>
                <Link to="/become-seller" style={styles.link}>Become Seller</Link>
              </>
            )}

            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"  style={styles.link}>Login</Link>
            <Link to="/signup" style={styles.btn}>Sign Up</Link>
          </>
        )}
      </div>

      {/* Hamburger */}
      <button className="hamburger" onClick={() => setOpen(!open)}>
        {open ? "✕" : "☰"}
      </button>

      {/* Mobile Menu */}
      {open && (
        <div style={styles.mobileMenu}>
          {token ? (
            <>
              <span style={styles.mobileWelcome}>Hi, {user?.name}</span>

              <Link to="/products" style={styles.mobileLink} onClick={() => setOpen(false)}>
                My Products
              </Link>

              <Link to="/add-product" style={styles.mobileLink} onClick={() => setOpen(false)}>
                Add Product
              </Link>

              {user?.isSeller ? (
                <>
                  <Link to="/seller-dashboard" style={styles.mobileLink} onClick={() => setOpen(false)}>
                    Seller Dashboard
                  </Link>
                  <Link to="/profile" style={styles.mobileLink} onClick={() => setOpen(false)}>
                    Seller Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/profile" style={styles.mobileLink} onClick={() => setOpen(false)}>
                    Profile
                  </Link>
                  <Link to="/become-seller" style={styles.mobileLink} onClick={() => setOpen(false)}>
                    Become Seller
                  </Link>
                </>
              )}

              <button onClick={handleLogout} style={styles.mobileBtn}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"  style={styles.mobileLink} onClick={() => setOpen(false)}>Login</Link>
              <Link to="/signup" style={styles.mobileBtn}  onClick={() => setOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

const styles = {
  nav: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", padding: "1rem 2rem",
    background: "#0a0a0a", borderBottom: "1px solid #222222",
    position: "sticky", top: 0, zIndex: 100,
    backdropFilter: "blur(10px)"
  },
  logo: {
    color: "#ffffff", textDecoration: "none",
    fontSize: "1.5rem", fontWeight: "700",
    letterSpacing: "3px", textTransform: "uppercase"
  },
  link: { color: "#a0a0a0", textDecoration: "none", fontSize: "0.9rem" },
  welcome: { color: "#555555", fontSize: "0.85rem" },
  btn: {
    background: "#7c3aed", color: "#ffffff", border: "none",
    padding: "8px 20px", borderRadius: "8px", cursor: "pointer",
    fontWeight: "600", textDecoration: "none", fontSize: "0.9rem"
  },
  mobileMenu: {
    position: "absolute", top: "100%", left: 0, right: 0,
    background: "#0a0a0a", borderBottom: "1px solid #222222",
    padding: "1rem 2rem", display: "flex",
    flexDirection: "column", gap: "0.5rem", zIndex: 99
  },
  mobileWelcome: {
    color: "#555555", fontSize: "0.85rem",
    paddingBottom: "0.5rem", borderBottom: "1px solid #1a1a1a"
  },
  mobileLink: {
    color: "#a0a0a0", textDecoration: "none",
    fontSize: "1rem", padding: "0.75rem 0",
    borderBottom: "1px solid #1a1a1a", display: "block"
  },
  mobileBtn: {
    background: "#7c3aed", color: "#ffffff", border: "none",
    padding: "12px", borderRadius: "8px", cursor: "pointer",
    fontWeight: "600", fontSize: "1rem", textAlign: "center",
    textDecoration: "none", marginTop: "0.5rem", display: "block",
    width: "100%"
  }
}