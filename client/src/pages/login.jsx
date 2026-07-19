import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    if (!email.includes("@")) return "Please enter a valid email";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (isRegisterMode && !name.trim()) return "Name is required";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      if (isRegisterMode) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>TaskFlow AI</h1>
        <p style={styles.subtitle}>
          {isRegisterMode ? "Create your account" : "Log in to your dashboard"}
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegisterMode && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading
              ? "Please wait..."
              : isRegisterMode
                ? "Register"
                : "Log In"}
          </button>
        </form>

        <p style={styles.toggle}>
          {isRegisterMode
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <span
            style={styles.toggleLink}
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setError("");
            }}
          >
            {isRegisterMode ? "Log in" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "#0f172a",
    fontFamily: "system-ui, sans-serif",
  },
  card: {
    background: "#1e293b",
    padding: "40px",
    borderRadius: "12px",
    width: "360px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },
  title: {
    color: "#f8fafc",
    margin: 0,
    fontSize: "28px",
  },
  subtitle: {
    color: "#94a3b8",
    marginTop: "4px",
    marginBottom: "24px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f8fafc",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#6366f1",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "8px",
  },
  error: {
    color: "#f87171",
    fontSize: "13px",
    background: "rgba(248,113,113,0.1)",
    padding: "8px 12px",
    borderRadius: "6px",
  },
  toggle: {
    color: "#94a3b8",
    fontSize: "14px",
    textAlign: "center",
    marginTop: "20px",
  },
  toggleLink: {
    color: "#818cf8",
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default Login;
