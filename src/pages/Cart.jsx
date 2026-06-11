import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"
import BASE_URL from "../api.js"

export default function Cart() {
  const [cart, setCart]               = useState([])
  const [address, setAddress]         = useState("")
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState("")
  const navigate = useNavigate()
  const token    = localStorage.getItem("token")

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]")
    setCart(saved)
  }, [])

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return
    const updated = cart.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    )
    setCart(updated)
    localStorage.setItem("cart", JSON.stringify(updated))
  }

  const removeItem = (productId) => {
    const updated = cart.filter(item => item.productId !== productId)
    setCart(updated)
    localStorage.setItem("cart", JSON.stringify(updated))
  }

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  )

  const handleOrder = async () => {
    if (!token) { navigate("/login"); return }
    if (cart.length === 0) { setError("Cart is empty"); return }
    if (!address.trim()) { setError("Please enter delivery address"); return }

    setLoading(true)
    setError("")

    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/orders`,
        {
          items: cart.map(item => ({
            productId: item.productId,
            quantity:  item.quantity
          })),
          deliveryAddress: address
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      localStorage.setItem("cart", "[]")
      navigate("/order-confirm", { state: { orders: data.orders } })

    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>🛒 My Cart</h2>

        {cart.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ fontSize: "3rem" }}>🛒</p>
            <p style={{ color: "#555555" }}>Your cart is empty</p>
            <button style={styles.browseBtn} onClick={() => navigate("/")}>
              Browse Products
            </button>
          </div>
        ) : (
          <div style={styles.content}>
            <div style={styles.items}>
              {cart.map(item => (
                <div key={item.productId} style={styles.item}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} style={styles.itemImage} />
                  ) : (
                    <div style={styles.itemPlaceholder}>🛍️</div>
                  )}

                  <div style={styles.itemInfo}>
                    <h3 style={styles.itemName}>{item.name}</h3>
                    <p style={styles.itemPrice}>₹{item.price}</p>
                  </div>

                  <div style={styles.quantityControl}>
                    <button style={styles.qBtn}
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                      −
                    </button>
                    <span style={styles.quantity}>{item.quantity}</span>
                    <button style={styles.qBtn}
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                      +
                    </button>
                  </div>

                  <p style={styles.itemTotal}>
                    ₹{item.price * item.quantity}
                  </p>

                  <button style={styles.removeBtn}
                    onClick={() => removeItem(item.productId)}>
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div style={styles.summary}>
              <h3 style={styles.summaryTitle}>Order Summary</h3>

              <div style={styles.summaryRow}>
                <span style={{ color: "#a0a0a0" }}>Items ({cart.length})</span>
                <span style={{ color: "#ffffff" }}>₹{totalPrice}</span>
              </div>

              <div style={styles.summaryRow}>
                <span style={{ color: "#a0a0a0" }}>Delivery</span>
                <span style={{ color: "#22c55e" }}>Free</span>
              </div>

              <div style={{ ...styles.summaryRow, borderTop: "1px solid #222", paddingTop: "1rem" }}>
                <span style={{ color: "#ffffff", fontWeight: "700" }}>Total</span>
                <span style={{ color: "#7c3aed", fontWeight: "700", fontSize: "1.3rem" }}>
                  ₹{totalPrice}
                </span>
              </div>

              <label style={styles.label}>Delivery Address</label>
              <textarea
                style={styles.addressInput}
                placeholder="Enter your delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              {error && <p style={styles.error}>{error}</p>}

              <button
                style={{ ...styles.orderBtn, opacity: loading ? 0.7 : 1 }}
                onClick={handleOrder}
                disabled={loading}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: "1000px", margin: "0 auto", padding: "3rem 2rem" },
  title: { color: "#ffffff", fontSize: "2rem", fontWeight: "700", marginBottom: "2rem" },
  empty: { textAlign: "center", padding: "4rem" },
  browseBtn: {
    background: "#7c3aed", color: "#ffffff", border: "none",
    padding: "10px 20px", borderRadius: "8px", cursor: "pointer",
    marginTop: "1rem", fontSize: "0.9rem"
  },
  content: { display: "grid", gridTemplateColumns: "1fr 350px", gap: "2rem" },
  items: { display: "flex", flexDirection: "column", gap: "1rem" },
  item: {
    background: "#111111", border: "1px solid #222222",
    borderRadius: "12px", padding: "1rem 1.5rem",
    display: "flex", alignItems: "center", gap: "1rem"
  },
  itemImage: { width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover" },
  itemPlaceholder: {
    width: "60px", height: "60px", borderRadius: "8px",
    background: "#1a1a1a", display: "flex",
    alignItems: "center", justifyContent: "center", fontSize: "1.5rem"
  },
  itemInfo: { flex: 1 },
  itemName: { color: "#ffffff", fontWeight: "600", marginBottom: "0.25rem", fontSize: "0.95rem" },
  itemPrice: { color: "#555555", fontSize: "0.85rem" },
  quantityControl: { display: "flex", alignItems: "center", gap: "0.5rem" },
  qBtn: {
    background: "#1a1a1a", color: "#ffffff", border: "1px solid #333",
    width: "28px", height: "28px", borderRadius: "6px",
    cursor: "pointer", fontSize: "1rem", display: "flex",
    alignItems: "center", justifyContent: "center"
  },
  quantity: { color: "#ffffff", minWidth: "24px", textAlign: "center" },
  itemTotal: { color: "#7c3aed", fontWeight: "700", minWidth: "80px", textAlign: "right" },
  removeBtn: {
    background: "transparent", border: "none",
    color: "#555555", cursor: "pointer", fontSize: "1rem"
  },
  summary: {
    background: "#111111", border: "1px solid #222222",
    borderRadius: "16px", padding: "1.5rem",
    height: "fit-content", position: "sticky", top: "100px"
  },
  summaryTitle: { color: "#ffffff", fontWeight: "700", marginBottom: "1.5rem" },
  summaryRow: {
    display: "flex", justifyContent: "space-between",
    marginBottom: "0.75rem"
  },
  label: { display: "block", color: "#a0a0a0", fontSize: "0.85rem", margin: "1rem 0 8px" },
  addressInput: {
    width: "100%", padding: "10px 12px", borderRadius: "10px",
    border: "1px solid #222222", background: "#0a0a0a",
    color: "#ffffff", fontSize: "0.9rem", resize: "vertical",
    minHeight: "80px", boxSizing: "border-box", outline: "none"
  },
  error: {
    color: "#ef4444", fontSize: "0.85rem", margin: "0.5rem 0",
    padding: "8px", background: "#ef444410", borderRadius: "8px"
  },
  orderBtn: {
    width: "100%", padding: "14px", background: "#7c3aed",
    color: "#ffffff", border: "none", borderRadius: "10px",
    cursor: "pointer", fontWeight: "600", marginTop: "1rem",
    fontSize: "1rem"
  }
}