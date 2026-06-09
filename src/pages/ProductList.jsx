import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import BASE_URL from "../api.js"

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [deleteId, setDeleteId] = useState(null)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/products`)
      setProducts(data.products)
    } catch (err) { console.log(err) }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/products/${deleteId}`,
        { headers: { Authorization: `Bearer ${token}` } })
      setDeleteId(null)
      fetchProducts()
    } catch (err) { console.log(err) }
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>My Products</h2>
            <p style={styles.subtitle}>{products.length} products listed</p>
          </div>
          <button style={styles.addBtn} onClick={() => navigate("/add-product")}>
            + Add Product
          </button>
        </div>

        {products.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ fontSize: "3rem" }}>📦</p>
            <p style={{ color: "#555" }}>No products yet</p>
            <button style={styles.addBtn} onClick={() => navigate("/add-product")}>
              Add your first product
            </button>
          </div>
        ) : (
          <div style={styles.list}>
            {products.map(product => (
              <div key={product._id} style={styles.item}>

                {/* Image or emoji */}
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={styles.itemImage}
                  />
                ) : (
                  <div style={styles.itemIcon}>🛍️</div>
                )}

                <div style={styles.itemInfo}>
                  <h3 style={styles.itemName}>{product.name}</h3>
                  <p style={styles.itemSeller}>by {product.addedBy?.name}</p>
                </div>
                <p style={styles.itemPrice}>₹{product.price}</p>
                <div style={styles.itemActions}>
                  <button style={styles.editBtn}
                    onClick={() => navigate(`/edit-product/${product._id}`, { state: product })}>
                    Edit
                  </button>
                  <button style={styles.deleteBtn}
                    onClick={() => setDeleteId(product._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteId && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <h3 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>Delete Product?</h3>
            <p style={{ color: "#555555", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
              This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button style={styles.confirmBtn} onClick={handleDelete}>Delete</button>
              <button style={styles.cancelBtn} onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { maxWidth: "800px", margin: "0 auto", padding: "4rem 2rem" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" },
  title: { color: "#ffffff", fontSize: "2rem", fontWeight: "700", marginBottom: "0.25rem" },
  subtitle: { color: "#555555", fontSize: "0.9rem" },
  addBtn: {
    background: "#7c3aed", color: "#ffffff", border: "none",
    padding: "10px 20px", borderRadius: "10px", cursor: "pointer",
    fontWeight: "600", fontSize: "0.9rem"
  },
  empty: { textAlign: "center", padding: "4rem", color: "#555555" },
  list: { display: "flex", flexDirection: "column", gap: "1rem" },
  item: {
    background: "#111111", borderRadius: "12px", padding: "1.25rem 1.5rem",
    border: "1px solid #222222", display: "flex",
    alignItems: "center", gap: "1rem"
  },
  itemImage: {
    width: "60px", height: "60px",
    borderRadius: "10px", objectFit: "cover",
    border: "1px solid #222222", flexShrink: 0
  },
  itemIcon: { fontSize: "1.5rem", flexShrink: 0 },
  itemInfo: { flex: 1 },
  itemName: { color: "#ffffff", fontWeight: "600", marginBottom: "0.25rem", fontSize: "0.95rem" },
  itemSeller: { color: "#555555", fontSize: "0.8rem" },
  itemPrice: { color: "#7c3aed", fontWeight: "700", fontSize: "1.1rem" },
  itemActions: { display: "flex", gap: "0.5rem" },
  editBtn: {
    background: "#1a1a1a", color: "#ffffff", border: "1px solid #333",
    padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem"
  },
  deleteBtn: {
    background: "#ef444415", color: "#ef4444", border: "1px solid #ef444430",
    padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem"
  },
  overlay: {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    background: "rgba(0,0,0,0.8)", display: "flex",
    justifyContent: "center", alignItems: "center"
  },
  popup: {
    background: "#111111", padding: "2rem", borderRadius: "16px",
    textAlign: "center", width: "320px", border: "1px solid #222222"
  },
  confirmBtn: {
    flex: 1, padding: "10px", background: "#ef4444", color: "#ffffff",
    border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600"
  },
  cancelBtn: {
    flex: 1, padding: "10px", background: "#1a1a1a", color: "#a0a0a0",
    border: "1px solid #222222", borderRadius: "8px", cursor: "pointer"
  }
}