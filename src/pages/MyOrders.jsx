import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import BASE_URL from "../api.js"

export default function MyOrders() {
  const [orders, setOrders]   = useState([])
  const [incoming, setIncoming] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState("my")
  const navigate = useNavigate()
  const token    = localStorage.getItem("token")

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      const [myRes, inRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/orders/my`,
          { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/api/orders/incoming`,
          { headers: { Authorization: `Bearer ${token}` } })
      ])
      setOrders(myRes.data.orders)
      setIncoming(inRes.data.orders)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `${BASE_URL}/api/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchOrders()
    } catch (err) {
      console.log(err)
    }
  }

  const getStatusColor = (status) => {
    if (status === "delivered")  return "#22c55e"
    if (status === "shipped")    return "#7c3aed"
    if (status === "confirmed")  return "#3b82f6"
    if (status === "cancelled")  return "#ef4444"
    return "#f59e0b"
  }

  const nextStatus = {
    pending:   "confirmed",
    confirmed: "shipped",
    shipped:   "delivered"
  }

  const renderOrder = (order, isIncoming) => (
    <div key={order._id} style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <p style={styles.orderId}>#{order._id.slice(-8).toUpperCase()}</p>
          <p style={styles.date}>
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span style={{
          ...styles.status,
          color: getStatusColor(order.status),
          background: getStatusColor(order.status) + "20",
          border: `1px solid ${getStatusColor(order.status)}40`
        }}>
          {order.status}
        </span>
      </div>

      <div style={styles.items}>
        {order.items.map((item, i) => (
          <div key={i} style={styles.item}>
            {item.image ? (
              <img src={item.image} alt={item.name} style={styles.itemImage} />
            ) : (
              <div style={styles.itemPlaceholder}>🛍️</div>
            )}
            <div>
              <p style={styles.itemName}>{item.name}</p>
              <p style={styles.itemMeta}>
                ₹{item.price} × {item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.cardFooter}>
        <div>
          {isIncoming ? (
            <p style={styles.meta}>
              From: <span style={{ color: "#ffffff" }}>{order.buyer?.name}</span>
            </p>
          ) : (
            <p style={styles.meta}>
              Seller: <span style={{ color: "#ffffff" }}>{order.seller?.name}</span>
            </p>
          )}
          <p style={styles.total}>Total: ₹{order.totalPrice}</p>
        </div>

        {isIncoming && nextStatus[order.status] && (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              style={styles.updateBtn}
              onClick={() => updateStatus(order._id, nextStatus[order.status])}
            >
              Mark as {nextStatus[order.status]}
            </button>
            {order.status === "pending" && (
              <button
                style={styles.cancelBtn}
                onClick={() => updateStatus(order._id, "cancelled")}
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Orders</h2>

        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(tab === "my" ? styles.tabActive : {}) }}
            onClick={() => setTab("my")}
          >
            My Orders ({orders.length})
          </button>
          <button
            style={{ ...styles.tab, ...(tab === "incoming" ? styles.tabActive : {}) }}
            onClick={() => setTab("incoming")}
          >
            Incoming ({incoming.length})
          </button>
        </div>

        {loading ? (
          <p style={{ color: "#555" }}>Loading...</p>
        ) : tab === "my" ? (
          orders.length === 0 ? (
            <div style={styles.empty}>
              <p style={{ fontSize: "3rem" }}>📦</p>
              <p style={{ color: "#555555" }}>No orders yet</p>
              <button style={styles.browseBtn} onClick={() => navigate("/")}>
                Browse Products
              </button>
            </div>
          ) : (
            orders.map(o => renderOrder(o, false))
          )
        ) : (
          incoming.length === 0 ? (
            <div style={styles.empty}>
              <p style={{ fontSize: "3rem" }}>📦</p>
              <p style={{ color: "#555555" }}>No incoming orders</p>
            </div>
          ) : (
            incoming.map(o => renderOrder(o, true))
          )
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: "900px", margin: "0 auto", padding: "3rem 2rem" },
  title: { color: "#ffffff", fontSize: "2rem", fontWeight: "700", marginBottom: "2rem" },
  tabs: { display: "flex", gap: "1rem", marginBottom: "2rem" },
  tab: {
    padding: "10px 24px", borderRadius: "10px",
    border: "1px solid #222222", background: "#111111",
    color: "#a0a0a0", cursor: "pointer", fontSize: "0.9rem"
  },
  tabActive: { background: "#7c3aed", color: "#ffffff", border: "1px solid #7c3aed" },
  empty: { textAlign: "center", padding: "4rem" },
  browseBtn: {
    background: "#7c3aed", color: "#ffffff", border: "none",
    padding: "10px 20px", borderRadius: "8px", cursor: "pointer",
    marginTop: "1rem"
  },
  card: {
    background: "#111111", border: "1px solid #222222",
    borderRadius: "16px", padding: "1.5rem", marginBottom: "1rem"
  },
  cardHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "1rem"
  },
  orderId: { color: "#ffffff", fontWeight: "700", fontSize: "1rem" },
  date: { color: "#555555", fontSize: "0.8rem" },
  status: {
    padding: "4px 12px", borderRadius: "20px",
    fontSize: "0.8rem", fontWeight: "600", textTransform: "capitalize"
  },
  items: { marginBottom: "1rem" },
  item: { display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" },
  itemImage: { width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover" },
  itemPlaceholder: {
    width: "50px", height: "50px", borderRadius: "8px",
    background: "#1a1a1a", display: "flex",
    alignItems: "center", justifyContent: "center"
  },
  itemName: { color: "#ffffff", fontSize: "0.9rem", fontWeight: "600" },
  itemMeta: { color: "#555555", fontSize: "0.8rem" },
  cardFooter: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", borderTop: "1px solid #1a1a1a", paddingTop: "1rem"
  },
  meta: { color: "#555555", fontSize: "0.85rem", marginBottom: "0.25rem" },
  total: { color: "#7c3aed", fontWeight: "700" },
  updateBtn: {
    background: "#7c3aed", color: "#ffffff", border: "none",
    padding: "8px 16px", borderRadius: "8px", cursor: "pointer",
    fontSize: "0.85rem", fontWeight: "600"
  },
  cancelBtn: {
    background: "#ef444415", color: "#ef4444",
    border: "1px solid #ef444430", padding: "8px 16px",
    borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem"
  }
}