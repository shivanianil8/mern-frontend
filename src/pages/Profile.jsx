import { useState, useEffect } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"
import BASE_URL from "../api.js"

export default function Profile() {
  const [user, setUser]       = useState(null)
  const [form, setForm]       = useState({ phone: "", address: "", avatar: "" })
  const [editing, setEditing] = useState(false)
  const [error, setError]     = useState("")
  const [success, setSuccess] = useState("")
  const token = localStorage.getItem("token")

  useEffect(() => { fetchProfile() }, [])

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/auth/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUser(data.user)
      setForm({ phone: data.user.phone || "", address: data.user.address || "", avatar: data.user.avatar || "" })
    } catch (err) { console.log(err) }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "phone") {
      const n = value.replace(/[^0-9]/g, "")
      if (n.length <= 10) setForm({ ...form, phone: n })
      return
    }
    if (name === "address" && value.length > 100) return
    if (name === "avatar" && value.length > 200) return
    setForm({ ...form, [name]: value })
  }

  const validate = () => {
    if (form.phone && form.phone.length !== 10) return "Phone must be exactly 10 digits"
    if (form.address && form.address.trim().length < 5) return "Address must be at least 5 characters"
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError("")
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/auth/profile`, form,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUser(data.user)
      localStorage.setItem("user", JSON.stringify(data.user))
      setSuccess("Profile updated!")
      setEditing(false)
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) { setError(err.response?.data?.message || "Update failed") }
  }

  if (!user) return <div style={{ background: "#0a0a0a", minHeight: "100vh" }}><Navbar /></div>

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.profileHeader}>
          <div style={styles.avatarWrap}>
            {user.avatar ? (
              <img src={user.avatar} alt="avatar" style={styles.avatar} />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h2 style={styles.name}>{user.name}</h2>
            <p style={styles.email}>{user.email}</p>
            {user.isProfileComplete ? (
              <span style={styles.badgeComplete}>● Profile Complete</span>
            ) : (
              <span style={styles.badgeIncomplete}>● Profile Incomplete</span>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div style={styles.card}>
          {!editing ? (
            <>
              {success && <p style={styles.success}>{success}</p>}
              {[
                { label: "Phone", value: user.phone },
                { label: "Address", value: user.address },
                { label: "Avatar URL", value: user.avatar }
              ].map((item, i) => (
                <div key={i} style={styles.row}>
                  <span style={styles.rowLabel}>{item.label}</span>
                  <span style={styles.rowValue}>
                    {item.value || <span style={{ color: "#333" }}>Not added</span>}
                  </span>
                </div>
              ))}
              <button style={styles.editBtn} onClick={() => setEditing(true)}>
                Edit Profile
              </button>
              {!user.isProfileComplete && (
                <p style={styles.hint}>
                  Complete your profile to unlock adding products
                </p>
              )}
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              {error   && <p style={styles.error}>{error}</p>}
              {success && <p style={styles.success}>{success}</p>}

              {[
                { label: "Phone (10 digits)", name: "phone", placeholder: "Enter phone number", mode: "numeric" },
                { label: "Address", name: "address", placeholder: "Enter your address" },
                { label: "Avatar URL (optional)", name: "avatar", placeholder: "Paste image URL" }
              ].map((field, i) => (
                <div key={i}>
                  <label style={styles.label}>{field.label}</label>
                  <input
                    style={styles.input} name={field.name}
                    placeholder={field.placeholder}
                    value={form[field.name]} onChange={handleChange}
                    inputMode={field.mode}
                  />
                </div>
              ))}

              <button style={styles.saveBtn} type="submit">Save Changes</button>
              <button style={styles.cancelBtn} type="button"
                onClick={() => setEditing(false)}>Cancel</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: "600px", margin: "0 auto", padding: "4rem 2rem" },
  profileHeader: { display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" },
  avatarWrap: { flexShrink: 0 },
  avatar: { width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "2px solid #222" },
  avatarPlaceholder: {
    width: "80px", height: "80px", borderRadius: "50%",
    background: "#7c3aed20", border: "2px solid #7c3aed30",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "2rem", fontWeight: "700", color: "#7c3aed"
  },
  name: { color: "#ffffff", fontSize: "1.5rem", fontWeight: "700", margin: "0 0 0.25rem" },
  email: { color: "#555555", fontSize: "0.9rem", margin: "0 0 0.5rem" },
  badgeComplete: { color: "#22c55e", fontSize: "0.8rem" },
  badgeIncomplete: { color: "#f59e0b", fontSize: "0.8rem" },
  card: {
    background: "#111111", borderRadius: "16px",
    padding: "2rem", border: "1px solid #222222"
  },
  row: {
    display: "flex", justifyContent: "space-between",
    padding: "1rem 0", borderBottom: "1px solid #1a1a1a"
  },
  rowLabel: { color: "#555555", fontSize: "0.9rem" },
  rowValue: { color: "#ffffff", fontSize: "0.9rem" },
  editBtn: {
    width: "100%", padding: "12px", background: "#7c3aed",
    color: "#ffffff", border: "none", borderRadius: "10px",
    cursor: "pointer", marginTop: "1.5rem", fontSize: "0.95rem", fontWeight: "600"
  },
  hint: { color: "#f59e0b", fontSize: "0.8rem", textAlign: "center", marginTop: "1rem" },
  label: { display: "block", color: "#a0a0a0", fontSize: "0.85rem", marginBottom: "8px" },
  input: {
    width: "100%", padding: "12px 16px", margin: "0 0 16px 0",
    borderRadius: "10px", border: "1px solid #222222",
    background: "#0a0a0a", color: "#ffffff", fontSize: "1rem",
    boxSizing: "border-box", outline: "none"
  },
  saveBtn: {
    width: "100%", padding: "12px", background: "#7c3aed",
    color: "#ffffff", border: "none", borderRadius: "10px",
    cursor: "pointer", marginBottom: "8px", fontSize: "0.95rem", fontWeight: "600"
  },
  cancelBtn: {
    width: "100%", padding: "12px", background: "#1a1a1a",
    color: "#a0a0a0", border: "1px solid #222222", borderRadius: "10px",
    cursor: "pointer", fontSize: "0.95rem"
  },
  error: { color: "#ef4444", fontSize: "0.85rem", marginBottom: "1rem", padding: "10px", background: "#ef444410", borderRadius: "8px" },
  success: { color: "#22c55e", fontSize: "0.85rem", marginBottom: "1rem", padding: "10px", background: "#22c55e10", borderRadius: "8px" }
}