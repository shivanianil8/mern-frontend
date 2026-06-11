import { useNavigate } from "react-router-dom"

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.code}>404</h1>
        <div style={styles.divider} />
        <div>
          <h2 style={styles.title}>Page Not Found</h2>
          <p style={styles.text}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div style={styles.btns}>
            <button style={styles.homeBtn} onClick={() => navigate("/")}>
              Go Home
            </button>
            <button style={styles.backBtn} onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
      </div>
      <div style={styles.circle1} />
      <div style={styles.circle2} />
    </div>
  )
}

const styles = {
  container: {
    background: "#0a0a0a", minHeight: "100vh",
    display: "flex", alignItems: "center",
    justifyContent: "center", position: "relative",
    overflow: "hidden"
  },
  content: {
    display: "flex", alignItems: "center",
    gap: "3rem", zIndex: 2, flexWrap: "wrap",
    justifyContent: "center", textAlign: "center"
  },
  code: {
    fontSize: "8rem", fontWeight: "900",
    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    lineHeight: 1, margin: 0
  },
  divider: {
    width: "2px", height: "120px",
    background: "#222222"
  },
  title: {
    color: "#ffffff", fontSize: "2rem",
    fontWeight: "700", marginBottom: "0.75rem"
  },
  text: {
    color: "#555555", fontSize: "1rem",
    marginBottom: "2rem", maxWidth: "300px"
  },
  btns: { display: "flex", gap: "1rem", justifyContent: "center" },
  homeBtn: {
    background: "#7c3aed", color: "#ffffff",
    border: "none", padding: "12px 28px",
    borderRadius: "10px", cursor: "pointer",
    fontWeight: "600", fontSize: "0.95rem"
  },
  backBtn: {
    background: "transparent", color: "#a0a0a0",
    border: "1px solid #333333", padding: "12px 28px",
    borderRadius: "10px", cursor: "pointer",
    fontWeight: "600", fontSize: "0.95rem"
  },
  circle1: {
    position: "absolute", width: "500px", height: "500px",
    borderRadius: "50%", top: "-200px", right: "-100px",
    background: "radial-gradient(circle, #7c3aed15, transparent)"
  },
  circle2: {
    position: "absolute", width: "400px", height: "400px",
    borderRadius: "50%", bottom: "-150px", left: "-100px",
    background: "radial-gradient(circle, #a855f715, transparent)"
  }
}