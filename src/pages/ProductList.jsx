import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [deleteId, setDeleteId] = useState(null)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/products")
      setProducts(data.products)
    } catch (err) {
      console.log(err)
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/products/${deleteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setDeleteId(null)
      fetchProducts()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2>My Products</h2>
          <button style={styles.addBtn}
            onClick={() => navigate("/add-product")}>
            + Add Product
          </button>
        </div>

        {products.length === 0 ? (
          <p style={{ color: "#888", textAlign: "center" }}>
            No products yet. Add your first one!
          </p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Added By</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} style={styles.tr}>
                  <td style={styles.td}>{product.name}</td>
                  <td style={styles.td}>₹{product.price}</td>
                  <td style={styles.td}>{product.addedBy?.name}</td>
                  <td style={styles.td}>
                    <button style={styles.editBtn}
                      onClick={() => navigate(`/edit-product/${product._id}`,
                        { state: product })}>
                      Edit
                    </button>
                    <button style={styles.deleteBtn}
                      onClick={() => setDeleteId(product._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Popup */}
      {deleteId && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <h3>Are you sure?</h3>
            <p style={{ color: "#888" }}>
              This product will be permanently deleted.
            </p>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <button style={styles.confirmDelete} onClick={handleDelete}>
                Yes, Delete
              </button>
              <button style={styles.cancelDelete}
                onClick={() => setDeleteId(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { maxWidth: "900px", margin: "3rem auto", padding: "0 2rem" },
  header: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "2rem"
  },
  addBtn: {
    background: "#4f46e5", color: "white", border: "none",
    padding: "10px 20px", borderRadius: "8px", cursor: "pointer"
  },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f8f8f8" },
  th: { padding: "12px 16px", textAlign: "left", fontWeight: "600",
        borderBottom: "2px solid #eee" },
  tr: { borderBottom: "1px solid #eee" },
  td: { padding: "12px 16px" },
  editBtn: {
    background: "#4f46e5", color: "white", border: "none",
    padding: "6px 14px", borderRadius: "6px",
    cursor: "pointer", marginRight: "8px"
  },
  deleteBtn: {
    background: "#ef4444", color: "white", border: "none",
    padding: "6px 14px", borderRadius: "6px", cursor: "pointer"
  },
  overlay: {
    position: "fixed", top: 0, left: 0,
    width: "100%", height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex", justifyContent: "center", alignItems: "center"
  },
  popup: {
    background: "white", padding: "2rem",
    borderRadius: "12px", textAlign: "center",
    width: "320px", boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
  },
  confirmDelete: {
    background: "#ef4444", color: "white", border: "none",
    padding: "10px 20px", borderRadius: "6px",
    cursor: "pointer", flex: 1
  },
  cancelDelete: {
    background: "#f0f0f0", color: "#333", border: "none",
    padding: "10px 20px", borderRadius: "6px",
    cursor: "pointer", flex: 1
  }
}