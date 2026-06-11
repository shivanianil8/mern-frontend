import { useEffect, useState } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"
import BASE_URL from "../api"

export default function SwapRequests() {
  const [incoming, setIncoming] = useState([])
  const [outgoing, setOutgoing] = useState([])
  const [loading, setLoading]   = useState(true)
  const [tab, setTab]           = useState("incoming")

  const token = localStorage.getItem("token")

  useEffect(() => { fetchRequests() }, [])

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/swaps`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setIncoming(data.incoming || [])
      setOutgoing(data.outgoing || [])
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${BASE_URL}/api/swaps/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchRequests()
    } catch (err) {
      console.log(err)
    }
  }

  const getStatusColor = (status) => {
    if (status === "accepted") return "#22c55e"
    if (status === "rejected") return "#ef4444"
    return "#f59e0b"
  }

  const renderSwap = (swap, isIncoming) => (
    <div key={swap._id} style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <p style={styles.label}>Requested Product</p>
          <h3 style={styles.product}>
            {swap.requestedProduct?.name || "Unknown"}
          </h3>
        </div>
        <span style={{ fontSize: "1.5rem" }}>🔄</span>
        <div>
          <p style={styles.label}>Offered Product</p>
          <h3 style={styles.product}>
            {swap.offeredProduct?.name || "Unknown"}
          </h3>
        </div>
      </div>

      <div style={styles.cardFooter}>
        <div>
          {isIncoming ? (
            <p style={styles.label}>
              From: <span style={{ color: "#ffffff" }}>{swap.requester?.name}</span>
            </p>
          ) : (
            <p style={styles.label}>
              To: <span style={{ color: "#ffffff" }}>{swap.seller?.name}</span>
            </p>
          )}
        </div>

        <span style={{
          ...styles.status,
          color: getStatusColor(swap.status),
          background: getStatusColor(swap.status) + "20",
          border: `1px solid ${getStatusColor(swap.status)}40`
        }}>
          {swap.status}
        </span>
      </div>

      {isIncoming && swap.status === "pending" && (
        <div style={styles.actions}>
          <button
            style={styles.accept}
            onClick={() => updateStatus(swap._id, "accepted")}
          >
            ✓ Accept
          </button>
          <button
            style={styles.reject}
            onClick={() => updateStatus(swap._id, "rejected")}
          >
            ✕ Reject
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />

      <div style={styles.container}>
        <h2 style={styles.title}>Swap Requests</h2>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(tab === "incoming" ? styles.tabActive : {}) }}
            onClick={() => setTab("incoming")}
          >
            Incoming ({incoming.length})
          </button>
          <button
            style={{ ...styles.tab, ...(tab === "outgoing" ? styles.tabActive : {}) }}
            onClick={() => setTab("outgoing")}
          >
            Outgoing ({outgoing.length})
          </button>
        </div>

        {loading ? (
          <p style={styles.text}>Loading...</p>
        ) : tab === "incoming" ? (
          incoming.length === 0 ? (
            <div style={styles.empty}>
              <p style={{ fontSize: "3rem" }}>🔄</p>
              <p style={styles.text}>No incoming swap requests</p>
            </div>
          ) : (
            incoming.map(swap => renderSwap(swap, true))
          )
        ) : (
          outgoing.length === 0 ? (
            <div style={styles.empty}>
              <p style={{ fontSize: "3rem" }}>🔄</p>
              <p style={styles.text}>No outgoing swap requests</p>
            </div>
          ) : (
            outgoing.map(swap => renderSwap(swap, false))
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
  tabActive: {
    background: "#7c3aed", color: "#ffffff",
    border: "1px solid #7c3aed"
  },
  text: { color: "#a0a0a0" },
  empty: { textAlign: "center", padding: "4rem" },
  card: {
    background: "#111111", border: "1px solid #222222",
    borderRadius: "16px", padding: "1.5rem", marginBottom: "1rem"
  },
  cardHeader: {
    display: "flex", alignItems: "center",
    gap: "1rem", marginBottom: "1rem"
  },
  cardFooter: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", borderTop: "1px solid #1a1a1a",
    paddingTop: "1rem"
  },
  label: { color: "#555555", fontSize: "0.8rem", marginBottom: "0.25rem" },
  product: { color: "#ffffff", fontSize: "1rem", fontWeight: "600" },
  status: {
    padding: "4px 12px", borderRadius: "20px",
    fontSize: "0.8rem", fontWeight: "600",
    textTransform: "capitalize"
  },
  actions: { display: "flex", gap: "1rem", marginTop: "1rem" },
  accept: {
    background: "#22c55e", color: "#ffffff", border: "none",
    padding: "10px 20px", borderRadius: "8px",
    cursor: "pointer", fontWeight: "600"
  },
  reject: {
    background: "#ef444415", color: "#ef4444",
    border: "1px solid #ef444430", padding: "10px 20px",
    borderRadius: "8px", cursor: "pointer", fontWeight: "600"
  }
}