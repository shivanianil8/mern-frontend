export default function Spinner({ text = "Loading..." }) {
  return (
    <div style={styles.container}>
      <div style={styles.spinner} />
      <p style={styles.text}>{text}</p>
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: "1rem"
  },

  spinner: {
    width: "48px",
    height: "48px",
    border: "4px solid #1a1a1a",
    borderTop: "4px solid #7c3aed",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite"
  },

  text: {
    color: "#555555",
    fontSize: "0.9rem"
  }
}