import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.nav}>
      <div style={styles.brand} onClick={() => navigate("/")}>
        TaskFlow AI
      </div>
      <div style={styles.right}>
        <span style={styles.userName}>{user?.name}</span>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 32px",
    background: "#1e293b",
    borderBottom: "1px solid #334155",
  },
  brand: {
    color: "#f8fafc",
    fontWeight: 700,
    fontSize: "18px",
    cursor: "pointer",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  userName: {
    color: "#94a3b8",
    fontSize: "14px",
  },
  logoutBtn: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "1px solid #334155",
    background: "transparent",
    color: "#f8fafc",
    cursor: "pointer",
    fontSize: "13px",
  },
};

export default Navbar;
