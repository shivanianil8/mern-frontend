import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import BASE_URL from "../api.js"

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    if (!form.email.includes("@") || !form.email.includes(".")) return "Enter a valid email address"
    if (form.password.length < 6) return "Password must be at least 6 characters"
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    setError("")
    try {
      const { data } = await axios.post(`${BASE_URL}/api/auth/login`, form)
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Welcome Back</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email</label>
          <input style={styles.input} name="email" type="email"
            placeholder="Enter your email"
            value={form.email} onChange={handleChange} required />
          <label style={styles.label}>Password</label>
          <input style={styles.input} name="password" type="password"
            placeholder="Enter your password"
            value={form.password} onChange={handleChange}
            maxLength={20} required />
          <button style={styles.button} type="submit">Login</button>
        </form>
        <p>No account? <Link to="/signup">Sign Up</Link></p>
      </div>
    </div>
  )
}

const styles = {
  container: { display:"flex", justifyContent:"center",
    alignItems:"center", height:"100vh", background:"#f0f2f5" },
  card: { background:"white", padding:"2rem", borderRadius:"10px",
    width:"360px", boxShadow:"0 4px 20px rgba(0,0,0,0.1)" },
  label: { display:"block", marginBottom:"4px", fontWeight:"500", color:"#555" },
  input: { width:"100%", padding:"10px", margin:"0 0 16px 0",
    borderRadius:"6px", border:"1px solid #ccc",
    boxSizing:"border-box", fontSize:"1rem" },
  button: { width:"100%", padding:"10px", background:"#4f46e5",
    color:"white", border:"none", borderRadius:"6px",
    cursor:"pointer", marginTop:"10px", fontSize:"1rem" },
  error: { color:"red", fontSize:"14px", marginBottom:"10px" }
}