import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"
import BASE_URL from "../api.js"

export default function Home() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch]     = useState("")
  const [sortBy, setSortBy]     = useState("newest")
  const [category, setCategory] = useState("All")
  const [wishlist, setWishlist] = useState([])
  const token    = localStorage.getItem("token")
  const navigate = useNavigate()

  const fetchWishlist = async () => {
    if (!token) return

    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/auth/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setWishlist(data.wishlist.map(item => item._id))
    } catch (err) {
      console.log(err)
    }
  }

  const toggleWishlist = async (productId, e) => {
    e.stopPropagation()

    try {
      const exists = wishlist.includes(productId)

      if (exists) {
        await axios.delete(
          `${BASE_URL}/api/auth/wishlist/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setWishlist(prev =>
          prev.filter(id => id !== productId)
        )
      } else {
        await axios.post(
          `${BASE_URL}/api/auth/wishlist/${productId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setWishlist(prev => [...prev, productId])
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchWishlist()

    axios.get(`${BASE_URL}/api/products`)
      .then(({ data }) => {
        setProducts(data.products)
        setFiltered(data.products)
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    let result = [...products]

    if (search.trim()) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category !== "All") {
      result = result.filter(p => p.category === category)
    }

    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price)
    }

    setFiltered(result)
  }, [search, sortBy, category, products])

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <p style={styles.heroTag}>— Premium Marketplace</p>
          <h1 style={styles.heroTitle}>
            Shop Beyond<br />
            <span style={styles.heroAccent}>Ordinary</span>
          </h1>
          <p style={styles.heroText}>
            Discover unique products from verified sellers around you.
            Buy, sell and trade with confidence.
          </p>
          {!token ? (
            <div style={styles.heroBtns}>
              <Link to="/signup" style={styles.heroBtn}>Get Started</Link>
              <Link to="/login"  style={styles.heroBtnOutline}>Login</Link>
            </div>
          ) : (
            <div style={styles.heroBtns}>
              <Link to="/add-product" style={styles.heroBtn}>Add Product</Link>
              <Link to="/products"    style={styles.heroBtnOutline}>My Products</Link>
            </div>
          )}
        </div>
        <div style={styles.circle1} />
        <div style={styles.circle2} />
      </div>

      {/* Products */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>All Products</h2>
            <p style={styles.sectionSub}>{filtered.length} products found</p>
          </div>
        </div>

        {/* Search, Sort and Category */}
        <div style={styles.controls}>
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              style={styles.searchInput}
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button style={styles.clearBtn} onClick={() => setSearch("")}>✕</button>
            )}
          </div>

          <select
            style={styles.sort}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Food">Food</option>
            <option value="Books">Books</option>
            <option value="Furniture">Furniture</option>
            <option value="Sports">Sports</option>
            <option value="Beauty">Beauty</option>
            <option value="Other">Other</option>
          </select>

          <select
            style={styles.sort}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ fontSize: "3rem" }}>🔍</p>
            <p style={{ color: "#555" }}>
              {search ? `No products found for "${search}"` : "No products yet. Be the first to add one!"}
            </p>
            {search && (
              <button style={styles.clearSearch} onClick={() => setSearch("")}>
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map(product => (
              <div
                key={product._id}
                style={styles.card}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={styles.cardImage}
                  />
                ) : (
                  <div style={styles.cardImagePlaceholder}>
                    <span style={{ fontSize: "3rem" }}>🛍️</span>
                  </div>
                )}
                <div style={styles.cardBody}>
                  <button
                    style={styles.heartBtn}
                    onClick={(e) => toggleWishlist(product._id, e)}
                  >
                    {wishlist.includes(product._id) ? "❤️" : "🤍"}
                  </button>

                  <h3 style={styles.cardName}>{product.name}</h3>
                  <p style={styles.cardPrice}>₹{product.price}</p>
                  {product.category && (
                    <p style={styles.cardCategory}>{product.category}</p>
                  )}
                  <div style={styles.cardFooter}>
                    <span style={styles.cardSeller}>
                      by {product.addedBy?.name || "Unknown"}
                    </span>
                  </div>
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
  hero: {
    position: "relative", overflow: "hidden",
    padding: "8rem 2rem", textAlign: "center",
    background: "#0a0a0a"
  },
  heroContent: { position: "relative", zIndex: 2 },
  heroTag: {
    color: "#7c3aed", fontSize: "0.85rem",
    letterSpacing: "3px", textTransform: "uppercase",
    marginBottom: "1.5rem"
  },
  heroTitle: {
    fontSize: "4.5rem", fontWeight: "800",
    color: "#ffffff", lineHeight: 1.1,
    marginBottom: "1.5rem", letterSpacing: "-1px"
  },
  heroAccent: {
    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  heroText: {
    color: "#a0a0a0", fontSize: "1.1rem",
    maxWidth: "500px", margin: "0 auto 2.5rem", lineHeight: 1.7
  },
  heroBtns: {
    display: "flex", gap: "1rem",
    justifyContent: "center", flexWrap: "wrap"
  },
  heroBtn: {
    background: "#7c3aed", color: "#ffffff",
    padding: "14px 32px", borderRadius: "10px",
    textDecoration: "none", fontWeight: "600",
    fontSize: "0.95rem", letterSpacing: "0.5px"
  },
  heroBtnOutline: {
    background: "transparent", color: "#ffffff",
    padding: "14px 32px", borderRadius: "10px",
    textDecoration: "none", fontWeight: "600",
    border: "1px solid #333333", fontSize: "0.95rem"
  },
  circle1: {
    position: "absolute", width: "500px", height: "500px",
    borderRadius: "50%", top: "-200px", right: "-100px",
    background: "radial-gradient(circle, #7c3aed15, transparent)", zIndex: 1
  },
  circle2: {
    position: "absolute", width: "400px", height: "400px",
    borderRadius: "50%", bottom: "-150px", left: "-100px",
    background: "radial-gradient(circle, #a855f715, transparent)", zIndex: 1
  },
  section: { maxWidth: "1200px", margin: "0 auto", padding: "5rem 2rem" },
  sectionHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "2rem"
  },
  sectionTitle: { color: "#ffffff", fontSize: "2rem", fontWeight: "700", marginBottom: "0.25rem" },
  sectionSub: { color: "#555555", fontSize: "0.9rem" },
  controls: { display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" },
  searchWrap: {
    flex: 1, display: "flex", alignItems: "center",
    background: "#111111", borderRadius: "10px",
    border: "1px solid #222222", padding: "0 1rem",
    minWidth: "200px"
  },
  searchIcon: { fontSize: "1rem", marginRight: "0.5rem" },
  searchInput: {
    flex: 1, background: "transparent", border: "none",
    color: "#ffffff", fontSize: "1rem", padding: "12px 0",
    outline: "none"
  },
  clearBtn: {
    background: "transparent", border: "none",
    color: "#555555", cursor: "pointer", fontSize: "1rem"
  },
  sort: {
    background: "#111111", border: "1px solid #222222",
    color: "#ffffff", padding: "12px 16px", borderRadius: "10px",
    fontSize: "0.9rem", cursor: "pointer", outline: "none"
  },
  empty: { textAlign: "center", padding: "4rem" },
  clearSearch: {
    background: "#7c3aed", color: "#ffffff", border: "none",
    padding: "10px 20px", borderRadius: "8px", cursor: "pointer",
    marginTop: "1rem", fontSize: "0.9rem"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "1.5rem"
  },
  card: {
    background: "#111111", borderRadius: "16px",
    border: "1px solid #222222", overflow: "hidden",
    cursor: "pointer", transition: "border-color 0.2s, transform 0.2s"
  },
  cardImage: { width: "100%", height: "180px", objectFit: "cover" },
  cardImagePlaceholder: {
    width: "100%", height: "180px", background: "#1a1a1a",
    display: "flex", alignItems: "center", justifyContent: "center"
  },
  cardBody: {
    padding: "1.25rem",
    position: "relative"
  },
  heartBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "transparent",
    border: "none",
    fontSize: "1.4rem",
    cursor: "pointer"
  },
  cardName: { color: "#ffffff", fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem" },
  cardPrice: { color: "#7c3aed", fontSize: "1.3rem", fontWeight: "700", marginBottom: "0.25rem" },
  cardCategory: { color: "#a855f7", fontSize: "0.8rem", marginBottom: "0.75rem" },
  cardFooter: { borderTop: "1px solid #1a1a1a", paddingTop: "0.75rem" },
  cardSeller: { color: "#555555", fontSize: "0.8rem" }
}