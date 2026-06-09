import { useState, useEffect } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"

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
        "http://localhost:5000/api/auth/profile",
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUser(data.user)
      setForm({
        phone:   data.user.phone   || "",
        address: data.user.address || "",
        avatar:  data.user.avatar  || ""
      })
    } catch (err) { console.log(err) }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "phone") {
      const numbersOnly = value.replace(/[^0-9]/g, "")
      if (numbersOnly.length <= 10) {
        setForm({ ...form, phone: numbersOnly })
      }
      return
    }

    if (name === "address" && value.length > 100) return
    if (name === "avatar" && value.length > 200) return

    setForm({ ...form, [name]: value })
  }

  const validate = () => {
    if (form.phone && form.phone.length !== 10) {
      return "Phone number must be exactly 10 digits"
    }
    if (form.address && form.address.trim().length < 5) {
      return "Address must be at least 5 characters"
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setError("")
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/auth/profile",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUser(data.user)
      localStorage.setItem("user", JSON.stringify(data.user))
      setSuccess("Profile updated successfully!")
      setEditing(false)
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Update failed")
    }
  }

  if (!user) return (
    <div>
      <Navbar />
      <p style={{ padding: "2rem" }}>Loading...</p>
    </div>
  )

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.card}>

          <div style={styles.avatarSection}>
            {user.avatar ? (
              <img src={user.avatar} alt="avatar" style={styles.avatar} />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <h2 style={{ margin: "0.5rem 0", color: "white" }}>{user.name}</h2>
            <p style={{ color: "#c7d2fe", margin: 0 }}>{user.email}</p>
            {user.isProfileComplete ? (
              <span style={styles.badgeComplete}>Profile Complete</span>
            ) : (
              <span style={styles.badgeIncomplete}>Profile Incomplete</span>
            )}
          </div>

          {!editing ? (
            <div style={styles.infoSection}>
              {success && <p style={styles.success}>{success}</p>}
              <div style={styles.infoRow}>
                <span style={styles.label}>Phone</span>
                <span style={styles.value}>
                  {user.phone || <span style={{ color: "#ccc" }}>Not added</span>}
                </span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>Address</span>
                <span style={styles.value}>
                  {user.address || <span style={{ color: "#ccc" }}>Not added</span>}
                </span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>Avatar URL</span>
                <span style={styles.value}>
                  {user.avatar || <span style={{ color: "#ccc" }}>Not added</span>}
                </span>
              </div>
              <button style={styles.editBtn} onClick={() => setEditing(true)}>
                Edit Profile
              </button>
              {!user.isProfileComplete && (
                <p style={styles.hint}>
                  Add your phone and address to complete your profile
                  and unlock adding products!
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={styles.infoSection}>
              {error   && <p style={styles.error}>{error}</p>}
              {success && <p style={styles.success}>{success}</p>}

              <label style={styles.formLabel}>Phone (10 digits only)</label>
              <input
                style={styles.input}
                name="phone"
                placeholder="Enter 10 digit phone number"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
                inputMode="numeric"
              />
              <small style={styles.hint2}>{form.phone.length}/10 digits</small>

              <label style={styles.formLabel}>Address (max 100 characters)</label>
              <input
                style={styles.input}
                name="address"
                placeholder="Enter your address"
                value={form.address}
                onChange={handleChange}
                maxLength={100}
              />
              <small style={styles.hint2}>{form.address.length}/100 characters</small>

              <label style={styles.formLabel}>Avatar URL (optional)</label>
              <input
                style={styles.input}
                name="avatar"
                placeholder="Paste image URL"
                value={form.avatar}
                onChange={handleChange}
                maxLength={200}
              />

              <button style={styles.saveBtn} type="submit">Save Changes</button>
              <button
                style={styles.cancelBtn}
                type="button"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: "600px", margin: "3rem auto", padding: "0 2rem" },
  card: {
    background: "white", borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)", overflow: "hidden"
  },
  avatarSection: {
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    padding: "2.5rem", textAlign: "center"
  },
  avatar: {
    width: "90px", height: "90px", borderRadius: "50%",
    objectFit: "cover", border: "3px solid white", marginBottom: "0.5rem"
  },
  avatarPlaceholder: {
    width: "90px", height: "90px", borderRadius: "50%",
    background: "rgba(255,255,255,0.3)", display: "flex",
    alignItems: "center", justifyContent: "center",
    fontSize: "2.5rem", fontWeight: "bold",
    margin: "0 auto 0.5rem", border: "3px solid white", color: "white"
  },
  badgeComplete: {
    background: "#22c55e", color: "white",
    padding: "4px 12px", borderRadius: "20px",
    fontSize: "0.8rem", marginTop: "0.5rem", display: "inline-block"
  },
  badgeIncomplete: {
    background: "#f59e0b", color: "white",
    padding: "4px 12px", borderRadius: "20px",
    fontSize: "0.8rem", marginTop: "0.5rem", display: "inline-block"
  },
  infoSection: { padding: "1.5rem 2rem" },
  infoRow: {
    display: "flex", justifyContent: "space-between",
    padding: "12px 0", borderBottom: "1px solid #f0f0f0"
  },
  label:  { color: "#888", fontWeight: "500" },
  value:  { color: "#333" },
  editBtn: {
    width: "100%", padding: "10px", background: "#4f46e5",
    color: "white", border: "none", borderRadius: "8px",
    cursor: "pointer", marginTop: "1.5rem", fontSize: "1rem"
  },
  hint: {
    color: "#f59e0b", fontSize: "0.85rem",
    marginTop: "1rem", textAlign: "center"
  },
  hint2: {
    color: "#aaa", fontSize: "0.75rem",
    display: "block", marginBottom: "12px"
  },
  formLabel: {
    display: "block", marginBottom: "4px",
    fontWeight: "500", color: "#555"
  },
  input: {
    width: "100%", padding: "10px", margin: "0 0 4px 0",
    borderRadius: "6px", border: "1px solid #ccc",
    boxSizing: "border-box", fontSize: "1rem"
  },
  saveBtn: {
    width: "100%", padding: "10px", background: "#4f46e5",
    color: "white", border: "none", borderRadius: "6px",
    cursor: "pointer", marginBottom: "8px",
    marginTop: "1rem", fontSize: "1rem"
  },
  cancelBtn: {
    width: "100%", padding: "10px", background: "#f0f0f0",
    color: "#333", border: "none", borderRadius: "6px",
    cursor: "pointer", fontSize: "1rem"
  },
  error:   { color: "red", marginBottom: "10px" },
  success: { color: "green", marginBottom: "10px" }
}