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
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [onlySwap, setOnlySwap] = useState(false)
  const [onlyRent, setOnlyRent] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [wishlist, setWishlist] = useState([])
  const token    = localStorage.getItem("token")
  const navigate = useNavigate()

  const fetchWishlist = async () => {
    if (!token) return
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/auth/wishlist`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setWishlist(data.wishlist.map(item => item._id))
    } catch (err) { console.log(err) }
  }

  const toggleWishlist = async (productId, e) => {
    e.stopPropagation()
    if (!token) { navigate("/login"); return }
    try {
      const exists = wishlist.includes(productId)
      if (exists) {
        await axios.delete(
          `${BASE_URL}/api/auth/wishlist/${productId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setWishlist(prev => prev.filter(id => id !== productId))
      } else {
        await axios.post(
          `${BASE_URL}/api/auth/wishlist/${productId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setWishlist(prev => [...prev, productId])
      }
    } catch (err) { console.log(err) }
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

    // Search by name, description, seller
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.addedBy?.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      )
    }

    // Category filter
    if (category !== "All") {
      result = result.filter(p => p.category === category)
    }

    // Min price filter
    if (minPrice !== "") {
      result = result.filter(p => p.price >= Number(minPrice))
    }

    // Max price filter
    if (maxPrice !== "") {
      result = result.filter(p => p.price <= Number(maxPrice))
    }

    // Swap filter
    if (onlySwap) {
      result = result.filter(p => p.openToSwap)
    }

    // Rent filter
    if (onlyRent) {
      result = result.filter(p => p.rentAvailable)
    }

    // Sort
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === "name-az") {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "name-za") {
      result.sort((a, b) => b.name.localeCompare(a.name))
    }

    setFiltered(result)
  }, [search, sortBy, category, minPrice, maxPrice, onlySwap, onlyRent, products])

  const clearAllFilters = () => {
    setSearch("")
    setCategory("All")
    setMinPrice("")
    setMaxPrice("")
    setOnlySwap(false)
    setOnlyRent(false)
    setSortBy("newest")
  }

  const activeFilterCount = [
    category !== "All",
    minPrice !== "",
    maxPrice !== "",
    onlySwap,
    onlyRent
  ].filter(Boolean).length

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
              <Link to="/dashboard" style={styles.heroBtn}>Go to Dashboard</Link>
              <Link to="/wishlist"  style={styles.heroBtnOutline}>My Wishlist</Link>
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
          {activeFilterCount > 0 && (
            <button style={styles.clearAllBtn} onClick={clearAllFilters}>
              Clear all filters ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            placeholder="Search by name, description, category or seller..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button style={styles.clearBtn} onClick={() => setSearch("")}>✕</button>
          )}
        </div>

        {/* Filter Row */}
        <div style={styles.filterRow}>
          {/* Category */}
          <select
            style={styles.select}
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

          {/* Sort */}
          <select
            style={styles.select}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-az">Name: A to Z</option>
            <option value="name-za">Name: Z to A</option>
          </select>

          {/* Advanced Filter Toggle */}
          <button
            style={{
              ...styles.filterToggle,
              background: showFilters ? "#7c3aed" : "#111111",
              color: showFilters ? "#ffffff" : "#a0a0a0",
              border: showFilters ? "1px solid #7c3aed" : "1px solid #222222"
            }}
            onClick={() => setShowFilters(!showFilters)}
          >
            ⚙️ Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div style={styles.advancedPanel}>
            {/* Price Range */}
            <div style={styles.filterGroup}>
              <p style={styles.filterLabel}>Price Range (₹)</p>
              <div style={styles.priceRow}>
                <input
                  style={styles.priceInput}
                  type="number"
                  placeholder="Min price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  min="0"
                />
                <span style={{ color: "#555555" }}>—</span>
                <input
                  style={styles.priceInput}
                  type="number"
                  placeholder="Max price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div style={styles.filterGroup}>
              <p style={styles.filterLabel}>Quick Filters</p>
              <div style={styles.toggleRow}>
                <button
                  style={{
                    ...styles.toggleBtn,
                    background: onlySwap ? "#22c55e15" : "#111111",
                    color: onlySwap ? "#22c55e" : "#a0a0a0",
                    border: onlySwap ? "1px solid #22c55e40" : "1px solid #222222"
                  }}
                  onClick={() => setOnlySwap(!onlySwap)}
                >
                  🔄 Open to Swap
                </button>

                <button
                  style={{
                    ...styles.toggleBtn,
                    background: onlyRent ? "#7c3aed15" : "#111111",
                    color: onlyRent ? "#7c3aed" : "#a0a0a0",
                    border: onlyRent ? "1px solid #7c3aed40" : "1px solid #222222"
                  }}
                  onClick={() => setOnlyRent(!onlyRent)}
                >
                  🏠 Available for Rent
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Filter Tags */}
        {activeFilterCount > 0 && (
          <div style={styles.activeTags}>
            {category !== "All" && (
              <span style={styles.tag}>
                {category}
                <button style={styles.tagClose} onClick={() => setCategory("All")}>✕</button>
              </span>
            )}
            {minPrice !== "" && (
              <span style={styles.tag}>
                Min ₹{minPrice}
                <button style={styles.tagClose} onClick={() => setMinPrice("")}>✕</button>
              </span>
            )}
            {maxPrice !== "" && (
              <span style={styles.tag}>
                Max ₹{maxPrice}
                <button style={styles.tagClose} onClick={() => setMaxPrice("")}>✕</button>
              </span>
            )}
            {onlySwap && (
              <span style={styles.tag}>
                Open to Swap
                <button style={styles.tagClose} onClick={() => setOnlySwap(false)}>✕</button>
              </span>
            )}
            {onlyRent && (
              <span style={styles.tag}>
                For Rent
                <button style={styles.tagClose} onClick={() => setOnlyRent(false)}>✕</button>
              </span>
            )}
          </div>
        )}

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ fontSize: "3rem" }}>🔍</p>
            <p style={{ color: "#555" }}>
              {search
                ? `No products found for "${search}"`
                : "No products match your filters"}
            </p>
            <button style={styles.clearSearch} onClick={clearAllFilters}>
              Clear All Filters
            </button>
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
                  <img src={product.image} alt={product.name} style={styles.cardImage} />
                ) : (
                  <div style={styles.cardImagePlaceholder}>
                    <span style={{ fontSize: "3rem" }}>🛍️</span>
                  </div>
                )}

                {/* Badges */}
                <div style={styles.badges}>
                  {product.openToSwap && (
                    <span style={styles.swapBadge}>🔄 Swap</span>
                  )}
                  {product.rentAvailable && (
                    <span style={styles.rentBadge}>🏠 Rent</span>
                  )}
                </div>

                <div style={styles.cardBody}>
                  {token && (
                    <button
                      style={styles.heartBtn}
                      onClick={(e) => toggleWishlist(product._id, e)}
                    >
                      {wishlist.includes(product._id) ? "❤️" : "🤍"}
                    </button>
                  )}
                  <h3 style={styles.cardName}>{product.name}</h3>
                  <p style={styles.cardPrice}>₹{product.price}</p>
                  {product.rentAvailable && (
                    <p style={styles.cardRent}>
                      Rent: ₹{product.rentPrice}/{product.rentPer}
                    </p>
                  )}
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
    alignItems: "center", marginBottom: "1.5rem"
  },
  sectionTitle: { color: "#ffffff", fontSize: "2rem", fontWeight: "700", marginBottom: "0.25rem" },
  sectionSub: { color: "#555555", fontSize: "0.9rem" },
  clearAllBtn: {
    background: "transparent", color: "#ef4444",
    border: "1px solid #ef444430", padding: "8px 16px",
    borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem"
  },
  searchWrap: {
    display: "flex", alignItems: "center",
    background: "#111111", borderRadius: "12px",
    border: "1px solid #222222", padding: "0 1rem",
    marginBottom: "1rem"
  },
  searchIcon: { fontSize: "1rem", marginRight: "0.5rem" },
  searchInput: {
    flex: 1, background: "transparent", border: "none",
    color: "#ffffff", fontSize: "1rem", padding: "14px 0",
    outline: "none"
  },
  clearBtn: {
    background: "transparent", border: "none",
    color: "#555555", cursor: "pointer", fontSize: "1rem"
  },
  filterRow: {
    display: "flex", gap: "1rem",
    marginBottom: "1rem", flexWrap: "wrap"
  },
  select: {
    background: "#111111", border: "1px solid #222222",
    color: "#ffffff", padding: "10px 16px", borderRadius: "10px",
    fontSize: "0.9rem", cursor: "pointer", outline: "none"
  },
  filterToggle: {
    padding: "10px 16px", borderRadius: "10px",
    cursor: "pointer", fontSize: "0.9rem", fontWeight: "500"
  },
  advancedPanel: {
    background: "#111111", border: "1px solid #222222",
    borderRadius: "12px", padding: "1.5rem",
    marginBottom: "1rem", display: "flex",
    gap: "2rem", flexWrap: "wrap"
  },
  filterGroup: { flex: 1, minWidth: "200px" },
  filterLabel: {
    color: "#555555", fontSize: "0.8rem",
    textTransform: "uppercase", letterSpacing: "1px",
    marginBottom: "0.75rem"
  },
  priceRow: { display: "flex", alignItems: "center", gap: "0.75rem" },
  priceInput: {
    flex: 1, padding: "10px 12px", borderRadius: "8px",
    border: "1px solid #222222", background: "#0a0a0a",
    color: "#ffffff", fontSize: "0.9rem", outline: "none"
  },
  toggleRow: { display: "flex", gap: "0.75rem", flexWrap: "wrap" },
  toggleBtn: {
    padding: "8px 16px", borderRadius: "20px",
    cursor: "pointer", fontSize: "0.85rem", fontWeight: "500"
  },
  activeTags: {
    display: "flex", gap: "0.5rem",
    flexWrap: "wrap", marginBottom: "1.5rem"
  },
  tag: {
    background: "#7c3aed15", color: "#a855f7",
    border: "1px solid #7c3aed30", padding: "4px 10px",
    borderRadius: "20px", fontSize: "0.8rem",
    display: "flex", alignItems: "center", gap: "6px"
  },
  tagClose: {
    background: "transparent", border: "none",
    color: "#7c3aed", cursor: "pointer", fontSize: "0.75rem",
    padding: 0, lineHeight: 1
  },
  empty: { textAlign: "center", padding: "4rem" },
  clearSearch: {
    background: "#7c3aed", color: "#ffffff", border: "none",
    padding: "10px 20px", borderRadius: "8px", cursor: "pointer",
    marginTop: "1rem", fontSize: "0.9rem"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "1.5rem"
  },
  card: {
    background: "#111111", borderRadius: "16px",
    border: "1px solid #222222", overflow: "hidden",
    cursor: "pointer", position: "relative"
  },
  cardImage: { width: "100%", height: "200px", objectFit: "cover" },
  cardImagePlaceholder: {
    width: "100%", height: "200px", background: "#1a1a1a",
    display: "flex", alignItems: "center", justifyContent: "center"
  },
  badges: {
    position: "absolute", top: "10px", left: "10px",
    display: "flex", gap: "4px", flexWrap: "wrap"
  },
  swapBadge: {
    background: "#22c55e20", color: "#22c55e",
    border: "1px solid #22c55e30", padding: "2px 8px",
    borderRadius: "20px", fontSize: "0.7rem", fontWeight: "600"
  },
  rentBadge: {
    background: "#7c3aed20", color: "#a855f7",
    border: "1px solid #7c3aed30", padding: "2px 8px",
    borderRadius: "20px", fontSize: "0.7rem", fontWeight: "600"
  },
  cardBody: { padding: "1.25rem", position: "relative" },
  heartBtn: {
    position: "absolute", top: "10px", right: "10px",
    background: "transparent", border: "none",
    fontSize: "1.4rem", cursor: "pointer"
  },
  cardName: { color: "#ffffff", fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem" },
  cardPrice: { color: "#7c3aed", fontSize: "1.3rem", fontWeight: "700", marginBottom: "0.25rem" },
  cardRent: { color: "#22c55e", fontSize: "0.8rem", marginBottom: "0.25rem" },
  cardCategory: { color: "#a855f7", fontSize: "0.8rem", marginBottom: "0.75rem" },
  cardFooter: { borderTop: "1px solid #1a1a1a", paddingTop: "0.75rem" },
  cardSeller: { color: "#555555", fontSize: "0.8rem" }
}