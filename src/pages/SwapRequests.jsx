import { useEffect, useState } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"
import BASE_URL from "../api"

export default function SwapRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/swaps`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setRequests(data.requests || [])
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
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      fetchRequests()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />

      <div style={styles.container}>
        <h2 style={styles.title}>
          Swap Requests
        </h2>

        {loading ? (
          <p style={styles.text}>Loading...</p>
        ) : requests.length === 0 ? (
          <p style={styles.text}>
            No swap requests yet
          </p>
        ) : (
          requests.map((swap) => (
            <div
              key={swap._id}
              style={styles.card}
            >
              <h3 style={styles.product}>
                Requested:
                {" "}
                {swap.requestedProduct?.name}
              </h3>

              <h3 style={styles.product}>
                Offered:
                {" "}
                {swap.offeredProduct?.name}
              </h3>

              <p style={styles.status}>
                Status: {swap.status}
              </p>

              {swap.status === "pending" && (
                <div style={styles.actions}>
                  <button
                    style={styles.accept}
                    onClick={() =>
                      updateStatus(
                        swap._id,
                        "accepted"
                      )
                    }
                  >
                    Accept
                  </button>

                  <button
                    style={styles.reject}
                    onClick={() =>
                      updateStatus(
                        swap._id,
                        "rejected"
                      )
                    }
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "3rem 2rem"
  },

  title: {
    color: "#ffffff",
    marginBottom: "2rem"
  },

  text: {
    color: "#a0a0a0"
  },

  card: {
    background: "#111111",
    border: "1px solid #222222",
    borderRadius: "12px",
    padding: "1.5rem",
    marginBottom: "1rem"
  },

  product: {
    color: "#ffffff",
    marginBottom: "0.5rem"
  },

  status: {
    color: "#a0a0a0",
    marginTop: "1rem"
  },

  actions: {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem"
  },

  accept: {
    background: "#22c55e",
    color: "#ffffff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  reject: {
    background: "#ef4444",
    color: "#ffffff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer"
  }
}