import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"
import BASE_URL from "../api"

export default function ProposeSwap() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [myProducts, setMyProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/products`
      )

      const user = JSON.parse(
        localStorage.getItem("user")
      )

      const mine = data.products.filter(
        p => p.addedBy?._id === user?.id
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

    if (!selectedProduct) {
      setError("Select a product")
      return
    }

    try {
      await axios.post(
        `${BASE_URL}/api/swaps`,
        {
          requestedProduct: id,
          offeredProduct: selectedProduct
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setSuccess("Swap request sent!")

      setTimeout(() => {
        navigate("/swap-requests")
      }, 1500)

    } catch (err) {
      setError(
        err.response?.data?.message || "Failed"
      )
    }
  }

  if (loading) {
    return (
      <div style={{ color: "white", padding: "2rem" }}>
        Loading...
      </div>
    )
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>
            Propose a Swap
          </h2>

          {error && (
            <p style={styles.error}>{error}</p>
          )}

          {success && (
            <p style={styles.success}>{success}</p>
          )}

          <form onSubmit={handleSubmit}>

            <label style={styles.label}>
              Select your product
            </label>

            <select
              style={styles.input}
              value={selectedProduct}
              onChange={(e) =>
                setSelectedProduct(e.target.value)
              }
            >
              <option value="">
                Select Product
              </option>

              {myProducts.map(product => (
                <option
                  key={product._id}
                  value={product._id}
                >
                  {product.name}
                </option>
              ))}
            </select>

            <button
              style={styles.button}
              type="submit"
            >
              Send Swap Request
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "4rem 2rem"
  },

  card: {
    background: "#111111",
    padding: "2rem",
    borderRadius: "16px",
    border: "1px solid #222222"
  },

  title: {
    color: "#ffffff",
    marginBottom: "1.5rem"
  },

  label: {
    color: "#a0a0a0",
    display: "block",
    marginBottom: "8px"
  },

  input: {
    width: "100%",
    padding: "12px",
    background: "#0a0a0a",
    color: "#ffffff",
    border: "1px solid #222222",
    borderRadius: "10px",
    marginBottom: "1rem"
  },

  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background: "#7c3aed",
    color: "#ffffff",
    cursor: "pointer"
  },

  error: {
    color: "#ef4444",
    marginBottom: "1rem"
  },

  success: {
    color: "#22c55e",
    marginBottom: "1rem"
  }
}