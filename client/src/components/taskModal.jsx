import { useState } from "react";

const TaskModal = ({ projectId, onClose, onCreated }) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    onCreated({
      title,
      project: projectId,
      priority,
      dueDate: dueDate || undefined,
    });
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={styles.title}>Add Task</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            autoFocus
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={styles.input}
          >
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={styles.input}
          />
          {error && <div style={styles.error}>{error}</div>}
          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={styles.saveBtn}>
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modal: {
    background: "#1e293b",
    padding: "28px",
    borderRadius: "12px",
    width: "340px",
  },
  title: { color: "#f8fafc", margin: "0 0 16px 0" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f8fafc",
    outline: "none",
    fontSize: "14px",
  },
  error: { color: "#f87171", fontSize: "13px" },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    marginTop: "8px",
  },
  cancelBtn: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "transparent",
    color: "#f8fafc",
    cursor: "pointer",
  },
  saveBtn: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#6366f1",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default TaskModal;
