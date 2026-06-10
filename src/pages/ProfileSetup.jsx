import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import BASE_URL from "../api.js"

export default function ProfileSetup() {
  const [form, setForm] = useState({
    phone: "",
    address: "",
    avatar: ""
  })

  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))

    if (user?.isProfileComplete) {
      navigate("/dashboard")
    }
  }, [navigate])

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")

    const token = localStorage.getItem("token")

    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/auth/profile`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      )

      navigate("/dashboard")

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Update failed"
      )
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Complete Your Profile</h2>

        <p
          style={{
            color: "#888",
            marginTop: 0
          }}
        >
          Just a few more details
        </p>

        {error && (
          <p style={styles.error}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            name="avatar"
            placeholder="Avatar URL (optional)"
            value={form.avatar}
            onChange={handleChange}
          />

          <button
            style={styles.button}
            type="submit"
          >
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f0f2f5"
  },

  card: {
    background: "white",
    padding: "2rem",
    borderRadius: "10px",
    width: "360px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
    boxSizing: "border-box"
  },

  button: {
    width: "100%",
    padding: "10px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px"
  },

  error: {
    color: "red",
    fontSize: "14px"
  }
}