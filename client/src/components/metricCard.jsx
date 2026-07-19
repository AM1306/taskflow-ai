const MetricCard = ({ label, value, color }) => (
  <div style={{ ...styles.card, borderTop: `3px solid ${color}` }}>
    <div style={styles.value}>{value}</div>
    <div style={styles.label}>{label}</div>
  </div>
);

const styles = {
  card: {
    background: "#1e293b",
    borderRadius: "10px",
    padding: "20px",
    flex: 1,
    minWidth: "140px",
  },
  value: {
    fontSize: "32px",
    fontWeight: 700,
    color: "#f8fafc",
  },
  label: {
    fontSize: "13px",
    color: "#94a3b8",
    marginTop: "4px",
  },
};

export default MetricCard;
