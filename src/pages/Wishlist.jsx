import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"
import BASE_URL from "../api.js"

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/auth/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setWishlist(data.wishlist)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const removeWishlist = async (id) => {
    try {
      await axios.delete(
        `${BASE_URL}/api/auth/wishlist/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setWishlist(prev =>
        prev.filter(item => item._id !== id)
      )
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />

      <div style={styles.container}>
        <h1 style={styles.title}>❤️ My Wishlist</h1>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : wishlist.length === 0 ? (
          <div style={styles.emptyBox}>
            <h3>No saved products</h3>
            <p style={{ color: "#777" }}>
              Start adding products to your wishlist.
            </p>
          </div>
        ) : (
          <div style={styles.grid}>
            {wishlist.map(product => (
              <div
                key={product._id}
                style={styles.card}
                onClick={() =>
                  navigate(`/product/${product._id}`)
                }
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={styles.image}
                  />
                ) : (
                  <div style={styles.placeholder}>
                    🛍️
                  </div>
                )}

                <div style={styles.body}>
                  <h3 style={styles.name}>
                    {product.name}
                  </h3>

                  <p style={styles.price}>
                    ₹{product.price}
                  </p>

                  {product.category && (
                    <p style={styles.category}>
                      {product.category}
                    </p>
                  )}

                  <button
                    style={styles.removeBtn}
                    onClick={(e) => {
                      e.stopPropagation()
                      removeWishlist(product._id)
                    }}
                  >
                    Remove ❤️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px"
  },

  title: {
    color: "#fff",
    marginBottom: "30px"
  },

  emptyBox: {
    textAlign: "center",
    padding: "80px 20px",
    color: "#fff"
  },

  empty: {
    color: "#fff"
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px"
  },

  card: {
    background: "#111111",
    border: "1px solid #222",
    borderRadius: "16px",
    overflow: "hidden",
    cursor: "pointer"
  },

  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover"
  },

  placeholder: {
    width: "100%",
    height: "220px",
    background: "#1a1a1a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "3rem"
  },

  body: {
    padding: "16px"
  },

  name: {
    color: "#fff",
    marginBottom: "10px"
  },

  price: {
    color: "#7c3aed",
    fontWeight: "700",
    fontSize: "1.2rem"
  },

  category: {
    color: "#a855f7",
    marginTop: "5px",
    marginBottom: "15px"
  },

  removeBtn: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#ef4444",
    color: "#fff",
    cursor: "pointer"
  }
}