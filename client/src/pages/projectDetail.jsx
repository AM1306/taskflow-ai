import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/navbar";
import TaskModal from "../components/taskModal";
import ChatWidget from "../components/chatWidget";

const STATUS_CYCLE = {
  todo: "in-progress",
  "in-progress": "done",
  done: "todo",
};
const STATUS_COLORS = {
  todo: "#94a3b8",
  "in-progress": "#eab308",
  done: "#22c55e",
};
const PRIORITY_COLORS = { low: "#94a3b8", medium: "#6366f1", high: "#ef4444" };

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      const res = await api.get(`/tasks?projectId=${id}`);
      setTasks(res.data);
    } catch (err) {
      setError("Failed to load tasks");
    }
  };

  useEffect(() => {
    loadTasks();
  }, [id]);

  const handleCreateTask = async (taskData) => {
    try {
      await api.post("/tasks", taskData);
      setShowModal(false);
      loadTasks();
    } catch (err) {
      setError("Failed to create task");
    }
  };

  const cycleStatus = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, {
        status: STATUS_CYCLE[task.status],
      });
      loadTasks();
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      loadTasks();
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <button onClick={() => navigate("/")} style={styles.backBtn}>
          ← Back to Dashboard
        </button>

        {error && <div style={styles.errorBanner}>{error}</div>}

        <div style={styles.header}>
          <h2 style={styles.title}>Tasks</h2>
          <button style={styles.addBtn} onClick={() => setShowModal(true)}>
            + Add Task
          </button>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="all">All</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <table style={styles.table}>
          <thead>
            <tr style={styles.headRow}>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Priority</th>
              <th style={styles.th}>Due Date</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan={5} style={styles.emptyCell}>
                  No tasks here.
                </td>
              </tr>
            )}
            {filteredTasks.map((task) => (
              <tr key={task._id} style={styles.row}>
                <td style={styles.td}>{task.title}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      background: STATUS_COLORS[task.status],
                    }}
                    onClick={() => cycleStatus(task)}
                    title="Click to change status"
                  >
                    {task.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={{ color: PRIORITY_COLORS[task.priority] }}>
                    {task.priority}
                  </span>
                </td>
                <td style={styles.td}>
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "—"}
                </td>
                <td style={styles.td}>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => deleteTask(task._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <TaskModal
          projectId={id}
          onClose={() => setShowModal(false)}
          onCreated={handleCreateTask}
        />
      )}
      <ChatWidget />
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    fontFamily: "system-ui, sans-serif",
  },
  content: { padding: "32px", maxWidth: "900px", margin: "0 auto" },
  backBtn: {
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: "13px",
    marginBottom: "16px",
    padding: 0,
  },
  errorBanner: {
    background: "rgba(248,113,113,0.1)",
    color: "#f87171",
    padding: "10px 16px",
    borderRadius: "8px",
    marginBottom: "16px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  title: { color: "#f8fafc", margin: 0 },
  addBtn: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#6366f1",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
  filterSelect: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#1e293b",
    color: "#f8fafc",
    marginBottom: "16px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#1e293b",
    borderRadius: "10px",
    overflow: "hidden",
  },
  headRow: { borderBottom: "1px solid #334155" },
  th: {
    textAlign: "left",
    padding: "12px 16px",
    color: "#94a3b8",
    fontSize: "12px",
    textTransform: "uppercase",
  },
  row: { borderBottom: "1px solid #334155" },
  td: { padding: "14px 16px", color: "#f8fafc", fontSize: "14px" },
  emptyCell: { padding: "30px", textAlign: "center", color: "#94a3b8" },
  badge: {
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    color: "#0f172a",
    fontWeight: 600,
    cursor: "pointer",
  },
  deleteBtn: {
    background: "transparent",
    border: "1px solid #334155",
    color: "#f87171",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
  },
};

export default ProjectDetail;
