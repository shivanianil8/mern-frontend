import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import BASE_URL from "../api.js"
import "../App.css"

export default function Navbar() {
  const navigate          = useNavigate()
  const token             = localStorage.getItem("token")
  const user              = JSON.parse(localStorage.getItem("user"))
  const [open, setOpen]   = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const dropdownRef       = useRef(null)

  const cart      = JSON.parse(localStorage.getItem("cart") || "[]")
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
    setOpen(false)
    setDropdown(false)
  }

  const switchMode = async () => {
    const newMode = user?.activeMode === 'seller' ? 'buyer' : 'seller'
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/auth/switch-mode`,
        { mode: newMode },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      localStorage.setItem("user", JSON.stringify(data.user))
      window.location.reload()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <Link to="/" style={styles.logo}>Vyorra</Link>

      {/* Desktop Center Links */}
      <div className="desktop-links" style={{ gap: "2rem" }}>
        {token ? (
          <>
            <Link to="/" style={styles.link}>Home</Link>

            {user?.activeMode === 'seller' && (
              <>
                <Link to="/products"    style={styles.link}>My Products</Link>
                <Link to="/add-product" style={styles.link}>Add Product</Link>
                <Link to="/seller-dashboard" style={styles.link}>Seller Dashboard</Link>
              </>
            )}
          </>
        ) : (
          <>
            <Link to="/" style={styles.link}>Home</Link>
          </>
        )}
      </div>

      {/* Desktop Right */}
      <div style={styles.rightSection}>
        {token ? (
          <>
            {/* Cart */}
            <Link to="/cart" style={styles.cartBtn}>
              🛒
              {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
            </Link>

            {/* Profile Dropdown */}
            <div style={styles.dropdownWrap} ref={dropdownRef}>
              <button
                style={styles.profileBtn}
                onClick={() => setDropdown(!dropdown)}
              >
                <div style={styles.avatar}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span style={styles.userName}>{user?.name?.split(" ")[0]}</span>
                <span style={{ color: "#555", fontSize: "0.8rem" }}>▾</span>
              </button>

              {dropdown && (
                <div style={styles.dropdown}>
                  {/* Mode Badge */}
                  <div style={styles.modeBadge}>
                    {user?.activeMode === 'seller' ? '🏪 Seller Mode' : '🛍️ Buyer Mode'}
                  </div>

                  <Link to="/dashboard"  style={styles.dropItem} onClick={() => setDropdown(false)}>
                    📊 Dashboard
                  </Link>
                  <Link to="/profile"    style={styles.dropItem} onClick={() => setDropdown(false)}>
                    👤 Profile
                  </Link>
                  <Link to="/wishlist"   style={styles.dropItem} onClick={() => setDropdown(false)}>
                    ❤️ Wishlist
                  </Link>
                  <Link to="/my-orders" style={styles.dropItem} onClick={() => setDropdown(false)}>
                    📦 My Orders
                  </Link>
                  <Link to="/swap-requests" style={styles.dropItem} onClick={() => setDropdown(false)}>
                    🔄 Swaps
                  </Link>
                  <Link to="/my-rentals" style={styles.dropItem} onClick={() => setDropdown(false)}>
                    🏠 Rentals
                  </Link>

                  <div style={styles.dropDivider} />

                  {user?.isSeller && (
                    <button style={styles.dropItemBtn} onClick={() => { switchMode(); setDropdown(false) }}>
                      {user?.activeMode === 'seller' ? '👤 Switch to Buyer' : '🏪 Switch to Seller'}
                    </button>
                  )}

                  {!user?.isSeller && (
                    <Link to="/become-seller" style={styles.dropItem} onClick={() => setDropdown(false)}>
                      🏪 Become Seller
                    </Link>
                  )}

                  <div style={styles.dropDivider} />

                  <button style={styles.logoutItem} onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Link to="/login"  style={styles.link}>Login</Link>
            <Link to="/signup" style={styles.signupBtn}>Sign Up</Link>
          </div>
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
              <div style={styles.mobileModeBadge}>
                {user?.activeMode === 'seller' ? '🏪 Seller Mode' : '🛍️ Buyer Mode'}
              </div>

              <Link to="/"           style={styles.mobileLink} onClick={() => setOpen(false)}>Home</Link>
              <Link to="/dashboard"  style={styles.mobileLink} onClick={() => setOpen(false)}>📊 Dashboard</Link>
              <Link to="/profile"    style={styles.mobileLink} onClick={() => setOpen(false)}>👤 Profile</Link>
              <Link to="/cart"       style={styles.mobileLink} onClick={() => setOpen(false)}>🛒 Cart {cartCount > 0 && `(${cartCount})`}</Link>
              <Link to="/wishlist"   style={styles.mobileLink} onClick={() => setOpen(false)}>❤️ Wishlist</Link>
              <Link to="/my-orders"  style={styles.mobileLink} onClick={() => setOpen(false)}>📦 Orders</Link>
              <Link to="/swap-requests" style={styles.mobileLink} onClick={() => setOpen(false)}>🔄 Swaps</Link>
              <Link to="/my-rentals" style={styles.mobileLink} onClick={() => setOpen(false)}>🏠 Rentals</Link>

              {user?.activeMode === 'seller' && (
                <>
                  <Link to="/products"      style={styles.mobileLink} onClick={() => setOpen(false)}>My Products</Link>
                  <Link to="/add-product"   style={styles.mobileLink} onClick={() => setOpen(false)}>Add Product</Link>
                  <Link to="/seller-dashboard" style={styles.mobileLink} onClick={() => setOpen(false)}>Seller Dashboard</Link>
                </>
              )}

              {user?.isSeller ? (
                <button onClick={() => { switchMode(); setOpen(false) }} style={styles.mobileSwitchBtn}>
                  {user?.activeMode === 'seller' ? '👤 Switch to Buyer' : '🏪 Switch to Seller'}
                </button>
              ) : (
                <Link to="/become-seller" style={styles.mobileLink} onClick={() => setOpen(false)}>
                  🏪 Become Seller
                </Link>
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
    alignItems: "center", padding: "0.75rem 2rem",
    background: "#0a0a0a", borderBottom: "1px solid #1a1a1a",
    position: "sticky", top: 0, zIndex: 100,
    backdropFilter: "blur(10px)"
  },
  logo: {
    color: "#ffffff", textDecoration: "none",
    fontSize: "1.4rem", fontWeight: "800",
    letterSpacing: "3px", textTransform: "uppercase"
  },
  link: { color: "#a0a0a0", textDecoration: "none", fontSize: "0.9rem" },
  rightSection: { display: "flex", alignItems: "center", gap: "1rem" },
  cartBtn: {
    position: "relative", color: "#a0a0a0",
    textDecoration: "none", fontSize: "1.3rem",
    display: "flex", alignItems: "center"
  },
  cartBadge: {
    position: "absolute", top: "-8px", right: "-8px",
    background: "#7c3aed", color: "#ffffff",
    borderRadius: "50%", width: "18px", height: "18px",
    fontSize: "0.65rem", display: "flex",
    alignItems: "center", justifyContent: "center", fontWeight: "700"
  },
  profileBtn: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "#111111", border: "1px solid #222222",
    borderRadius: "50px", padding: "6px 12px 6px 6px",
    cursor: "pointer", color: "#ffffff"
  },
  avatar: {
    width: "28px", height: "28px", borderRadius: "50%",
    background: "#7c3aed", color: "#ffffff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "0.85rem", fontWeight: "700"
  },
  userName: { color: "#ffffff", fontSize: "0.85rem", fontWeight: "500" },
  dropdownWrap: { position: "relative" },
  dropdown: {
    position: "absolute", top: "calc(100% + 8px)", right: 0,
    background: "#111111", border: "1px solid #222222",
    borderRadius: "12px", padding: "0.5rem",
    minWidth: "200px", zIndex: 200,
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
  },
  modeBadge: {
    color: "#7c3aed", fontSize: "0.75rem", fontWeight: "600",
    padding: "6px 12px", marginBottom: "4px"
  },
  dropItem: {
    display: "block", color: "#a0a0a0", textDecoration: "none",
    padding: "8px 12px", borderRadius: "8px", fontSize: "0.9rem",
    transition: "background 0.2s"
  },
  dropItemBtn: {
    display: "block", width: "100%", textAlign: "left",
    color: "#a0a0a0", background: "transparent", border: "none",
    padding: "8px 12px", borderRadius: "8px", fontSize: "0.9rem",
    cursor: "pointer"
  },
  dropDivider: {
    borderTop: "1px solid #222222", margin: "4px 0"
  },
  logoutItem: {
    display: "block", width: "100%", textAlign: "left",
    color: "#ef4444", background: "transparent", border: "none",
    padding: "8px 12px", borderRadius: "8px", fontSize: "0.9rem",
    cursor: "pointer"
  },
  signupBtn: {
    background: "#7c3aed", color: "#ffffff", border: "none",
    padding: "8px 20px", borderRadius: "8px", cursor: "pointer",
    fontWeight: "600", textDecoration: "none", fontSize: "0.9rem"
  },
  mobileMenu: {
    position: "absolute", top: "100%", left: 0, right: 0,
    background: "#0a0a0a", borderBottom: "1px solid #222222",
    padding: "1rem 2rem", display: "flex",
    flexDirection: "column", gap: "0.25rem", zIndex: 99
  },
  mobileModeBadge: {
    color: "#7c3aed", fontSize: "0.8rem", fontWeight: "600",
    paddingBottom: "0.5rem", borderBottom: "1px solid #1a1a1a",
    marginBottom: "0.25rem"
  },
  mobileLink: {
    color: "#a0a0a0", textDecoration: "none",
    fontSize: "1rem", padding: "0.75rem 0",
    borderBottom: "1px solid #111111", display: "block"
  },
  mobileSwitchBtn: {
    background: "#1a1a1a", color: "#a0a0a0", border: "1px solid #333",
    padding: "10px", borderRadius: "8px", cursor: "pointer",
    fontSize: "0.9rem", textAlign: "left", width: "100%", marginTop: "0.5rem"
  },
  mobileBtn: {
    background: "#7c3aed", color: "#ffffff", border: "none",
    padding: "12px", borderRadius: "8px", cursor: "pointer",
    fontWeight: "600", fontSize: "1rem", textAlign: "center",
    textDecoration: "none", marginTop: "0.5rem", display: "block",
    width: "100%"
  }
}