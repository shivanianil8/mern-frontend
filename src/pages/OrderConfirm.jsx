import { useLocation, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function OrderConfirm() {
  const location = useLocation()
  const navigate = useNavigate()
  const orders   = location.state?.orders || []

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
          <h2 style={styles.title}>Order Placed!</h2>
          <p style={styles.subtitle}>
            Your order has been placed successfully.
            The seller will confirm it shortly.
          </p>

          <div style={styles.orders}>
            {orders.map((order, i) => (
              <div key={order._id} style={styles.orderCard}>
                <p style={styles.orderId}>Order #{order._id.slice(-8).toUpperCase()}</p>
                <p style={styles.orderItems}>
                  {order.items.length} item(s)
                </p>
                <p style={styles.orderTotal}>
                  Total: <span style={{ color: "#7c3aed" }}>₹{order.totalPrice}</span>
                </p>
                <span style={styles.status}>Pending</span>
              </div>
            ))}
          </div>

          <div style={styles.btns}>
            <button style={styles.ordersBtn} onClick={() => navigate("/my-orders")}>
              View My Orders
            </button>
            <button style={styles.homeBtn} onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: "flex", justifyContent: "center",
    alignItems: "center", minHeight: "80vh", padding: "2rem"
  },
  card: {
    background: "#111111", border: "1px solid #222222",
    borderRadius: "20px", padding: "3rem", textAlign: "center",
    maxWidth: "500px", width: "100%"
  },
  title: { color: "#ffffff", fontSize: "2rem", fontWeight: "700", marginBottom: "0.5rem" },
  subtitle: { color: "#a0a0a0", marginBottom: "2rem", lineHeight: 1.6 },
  orders: { marginBottom: "2rem" },
  orderCard: {
    background: "#0a0a0a", border: "1px solid #222222",
    borderRadius: "10px", padding: "1rem", marginBottom: "0.75rem",
    textAlign: "left"
  },
  orderId: { color: "#ffffff", fontWeight: "600", marginBottom: "0.25rem" },
  orderItems: { color: "#555555", fontSize: "0.85rem", marginBottom: "0.25rem" },
  orderTotal: { color: "#a0a0a0", fontSize: "0.9rem", marginBottom: "0.5rem" },
  status: {
    background: "#f59e0b20", color: "#f59e0b",
    border: "1px solid #f59e0b40", padding: "2px 10px",
    borderRadius: "20px", fontSize: "0.8rem"
  },
  btns: { display: "flex", gap: "1rem", justifyContent: "center" },
  ordersBtn: {
    background: "#7c3aed", color: "#ffffff", border: "none",
    padding: "12px 24px", borderRadius: "10px",
    cursor: "pointer", fontWeight: "600"
  },
  homeBtn: {
    background: "transparent", color: "#a0a0a0",
    border: "1px solid #333", padding: "12px 24px",
    borderRadius: "10px", cursor: "pointer"
  }
}