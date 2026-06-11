import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"
import BASE_URL from "../api"

export default function ProposeSwap() {
  const { id }     = useParams()
  const navigate   = useNavigate()

  const [myProducts, setMyProducts]         = useState([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState("")
  const [success, setSuccess]               = useState("")

  const token = localStorage.getItem("token")

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/products`)
      const user   = JSON.parse(localStorage.getItem("user"))
      const userId = user?.id || user?._id

      const mine = data.products.filter(
        p => p.addedBy?._id === userId ||
             p.addedBy === userId
      )
      setMyProducts(mine)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedProduct) { setError("Select a product"); return }

    try {
      await axios.post(
        `${BASE_URL}/api/swaps`,
        { requestedProduct: id, offeredProduct: selectedProduct },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSuccess("Swap request sent!")
      setTimeout(() => navigate("/swap-requests"), 1500)
    } catch (err) {
      setError(err.response?.data?.message || "Failed")
    }
  }

  if (loading) {
    return (
      <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ color: "white", padding: "2rem" }}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Propose a Swap</h2>
          <p style={{ color: "#555555", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
            Select one of your products to offer in exchange
          </p>

          {error   && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          {myProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p style={{ fontSize: "2rem" }}>📦</p>
              <p style={{ color: "#555555", marginBottom: "1rem" }}>
                You have no products to offer
              </p>
              <button
                style={styles.button}
                onClick={() => navigate("/add-product")}
              >
                Add a Product First
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label style={styles.label}>Select your product</label>
              <select
                style={styles.input}
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">-- Select a product --</option>
                {myProducts.map(product => (
                  <option key={product._id} value={product._id}>
                    {product.name} — ₹{product.price}
                  </option>
                ))}
              </select>

              <button style={styles.button} type="submit">
                Send Swap Request
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: "600px", margin: "0 auto", padding: "4rem 2rem" },
  card: {
    background: "#111111", padding: "2rem",
    borderRadius: "16px", border: "1px solid #222222"
  },
  title: { color: "#ffffff", marginBottom: "0.5rem", fontSize: "1.8rem", fontWeight: "700" },
  label: { color: "#a0a0a0", display: "block", marginBottom: "8px", fontSize: "0.85rem" },
  input: {
    width: "100%", padding: "12px 16px", background: "#0a0a0a",
    color: "#ffffff", border: "1px solid #222222",
    borderRadius: "10px", marginBottom: "1.5rem",
    fontSize: "1rem", outline: "none"
  },
  button: {
    width: "100%", padding: "14px", border: "none",
    borderRadius: "10px", background: "#7c3aed",
    color: "#ffffff", cursor: "pointer",
    fontWeight: "600", fontSize: "1rem"
  },
  error: {
    color: "#ef4444", marginBottom: "1rem",
    padding: "10px", background: "#ef444410", borderRadius: "8px"
  },
  success: {
    color: "#22c55e", marginBottom: "1rem",
    padding: "10px", background: "#22c55e10", borderRadius: "8px"
  }
}