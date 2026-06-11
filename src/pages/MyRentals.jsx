import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import BASE_URL from "../api.js"

export default function MyRentals() {
  const [rentals, setRentals]   = useState([])
  const [incoming, setIncoming] = useState([])
  const [loading, setLoading]   = useState(true)
  const [tab, setTab]           = useState("my")
  const navigate = useNavigate()
  const token    = localStorage.getItem("token")

  useEffect(() => { fetchRentals() }, [])

  const fetchRentals = async () => {
    try {
      const [myRes, inRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/rentals/my`,
          { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/api/rentals/incoming`,
          { headers: { Authorization: `Bearer ${token}` } })
      ])
      setRentals(myRes.data.rentals)
      setIncoming(inRes.data.rentals)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    if (status === "active")    return "#22c55e"
    if (status === "completed") return "#7c3aed"
    return "#ef4444"
  }

  const renderRental = (rental, isIncoming) => (
    <div key={rental._id} style={styles.card}>
      <div style={styles.cardLeft}>
        {rental.product?.image ? (
          <img src={rental.product.image} alt={rental.product.name} style={styles.image} />
        ) : (
          <div style={styles.imagePlaceholder}>🛍️</div>
        )}
      </div>

      <div style={styles.cardInfo}>
        <h3 style={styles.productName}>{rental.product?.name}</h3>
        <p style={styles.meta}>
          Duration: {rental.duration} {rental.rentPer}(s)
        </p>
        <p style={styles.meta}>
          Total: <span style={{ color: "#7c3aed", fontWeight: "700" }}>₹{rental.totalPrice}</span>
        </p>
        <p style={styles.meta}>
          End Date: {new Date(rental.endDate).toLocaleDateString()}
        </p>
        {isIncoming ? (
          <p style={styles.meta}>
            Renter: <span style={{ color: "#ffffff" }}>{rental.renter?.name}</span>
          </p>
        ) : (
          <p style={styles.meta}>
            From: <span style={{ color: "#ffffff" }}>{rental.seller?.name}</span>
          </p>
        )}
      </div>

      <span style={{
        ...styles.status,
        color: getStatusColor(rental.status),
        background: getStatusColor(rental.status) + "20",
        border: `1px solid ${getStatusColor(rental.status)}40`
      }}>
        {rental.status}
      </span>
    </div>
  )

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Rentals</h2>

        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(tab === "my" ? styles.tabActive : {}) }}
            onClick={() => setTab("my")}
          >
            My Rentals ({rentals.length})
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
          rentals.length === 0 ? (
            <div style={styles.empty}>
              <p style={{ fontSize: "3rem" }}>🏠</p>
              <p style={{ color: "#555555" }}>No rentals yet</p>
              <button style={styles.browseBtn} onClick={() => navigate("/")}>
                Browse Products
              </button>
            </div>
          ) : (
            rentals.map(r => renderRental(r, false))
          )
        ) : (
          incoming.length === 0 ? (
            <div style={styles.empty}>
              <p style={{ fontSize: "3rem" }}>🏠</p>
              <p style={{ color: "#555555" }}>No incoming rentals</p>
            </div>
          ) : (
            incoming.map(r => renderRental(r, true))
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
    marginTop: "1rem", fontSize: "0.9rem"
  },
  card: {
    background: "#111111", border: "1px solid #222222",
    borderRadius: "16px", padding: "1.5rem", marginBottom: "1rem",
    display: "flex", alignItems: "center", gap: "1.5rem"
  },
  cardLeft: { flexShrink: 0 },
  image: { width: "80px", height: "80px", borderRadius: "10px", objectFit: "cover" },
  imagePlaceholder: {
    width: "80px", height: "80px", borderRadius: "10px",
    background: "#1a1a1a", display: "flex",
    alignItems: "center", justifyContent: "center", fontSize: "2rem"
  },
  cardInfo: { flex: 1 },
  productName: { color: "#ffffff", fontWeight: "600", marginBottom: "0.5rem" },
  meta: { color: "#555555", fontSize: "0.85rem", marginBottom: "0.25rem" },
  status: {
    padding: "4px 12px", borderRadius: "20px",
    fontSize: "0.8rem", fontWeight: "600",
    textTransform: "capitalize", flexShrink: 0
  }
}