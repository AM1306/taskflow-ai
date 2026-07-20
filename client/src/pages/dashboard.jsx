import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../utils/api";
import Navbar from "../components/navbar";
import MetricCard from "../components/metricCard";
import ChatWidget from "../components/chatWidget";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [showNewProject, setShowNewProject] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      setError("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;
    try {
      await api.post("/projects", { title: newProjectTitle });
      setNewProjectTitle("");
      setShowNewProject(false);
      loadStats();
    } catch (err) {
      setError("Failed to create project");
    }
  };

  if (!stats) return <div style={styles.loading}>Loading dashboard...</div>;

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        {error && <div style={styles.errorBanner}>{error}</div>}

        <div style={styles.metricsRow}>
          <MetricCard
            label="Total Tasks"
            value={stats.totalTasks}
            color="#6366f1"
          />
          <MetricCard
            label="Completed"
            value={stats.completedTasks}
            color="#22c55e"
          />
          <MetricCard
            label="In Progress"
            value={stats.inProgressTasks}
            color="#eab308"
          />
          <MetricCard
            label="Overdue"
            value={stats.overdueTasks}
            color="#ef4444"
          />
        </div>

        <div style={styles.chartsRow}>
          <div style={styles.chartBox}>
            <h3 style={styles.chartTitle}>Tasks by Status</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.tasksByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="status" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "#1e293b", border: "none" }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.chartBox}>
            <h3 style={styles.chartTitle}>Completed (Last 14 Days)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stats.completedPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  tick={{ fontSize: 10 }}
                />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "#1e293b", border: "none" }}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#22c55e"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={styles.projectsHeader}>
          <h2 style={styles.sectionTitle}>Your Projects</h2>
          <button
            style={styles.newProjectBtn}
            onClick={() => setShowNewProject(!showNewProject)}
          >
            + New Project
          </button>
        </div>

        {showNewProject && (
          <form onSubmit={handleCreateProject} style={styles.newProjectForm}>
            <input
              type="text"
              placeholder="Project title"
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              style={styles.input}
              autoFocus
            />
            <button type="submit" style={styles.saveBtn}>
              Create
            </button>
          </form>
        )}

        <div style={styles.projectsGrid}>
          {stats.projects.length === 0 && (
            <div style={styles.emptyState}>
              No projects yet — create one to get started.
            </div>
          )}
          {stats.projects.map((project) => (
            <div
              key={project._id}
              style={styles.projectCard}
              onClick={() => navigate(`/projects/${project._id}`)}
            >
              <div style={styles.projectTitle}>{project.title}</div>
              <div style={styles.projectMeta}>{project.taskCount} tasks</div>
              <div style={styles.progressBarOuter}>
                <div
                  style={{
                    ...styles.progressBarInner,
                    width: `${project.completionPercent}%`,
                  }}
                />
              </div>
              <div style={styles.projectMeta}>
                {project.completionPercent}% complete
              </div>
              {project.deadline && (
                <div style={styles.projectMeta}>
                  Due {new Date(project.deadline).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
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
  loading: {
    color: "#f8fafc",
    padding: "40px",
    fontFamily: "system-ui, sans-serif",
  },
  content: { padding: "32px", maxWidth: "1100px", margin: "0 auto" },
  errorBanner: {
    background: "rgba(248,113,113,0.1)",
    color: "#f87171",
    padding: "10px 16px",
    borderRadius: "8px",
    marginBottom: "16px",
  },
  metricsRow: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  chartsRow: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "32px",
  },
  chartBox: {
    flex: 1,
    minWidth: "320px",
    background: "#1e293b",
    borderRadius: "10px",
    padding: "20px",
  },
  chartTitle: { color: "#f8fafc", fontSize: "14px", margin: "0 0 12px 0" },
  projectsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  sectionTitle: { color: "#f8fafc", fontSize: "20px", margin: 0 },
  newProjectBtn: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#6366f1",
    color: "#fff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
  },
  newProjectForm: { display: "flex", gap: "8px", marginBottom: "20px" },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#1e293b",
    color: "#f8fafc",
    outline: "none",
  },
  saveBtn: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#22c55e",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
  projectsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "16px",
  },
  emptyState: {
    color: "#94a3b8",
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "40px",
  },
  projectCard: {
    background: "#1e293b",
    borderRadius: "10px",
    padding: "20px",
    cursor: "pointer",
    border: "1px solid #334155",
  },
  projectTitle: {
    color: "#f8fafc",
    fontWeight: 600,
    fontSize: "16px",
    marginBottom: "8px",
  },
  projectMeta: { color: "#94a3b8", fontSize: "12px", marginTop: "4px" },
  progressBarOuter: {
    background: "#334155",
    borderRadius: "4px",
    height: "6px",
    marginTop: "10px",
    overflow: "hidden",
  },
  progressBarInner: { background: "#6366f1", height: "100%" },
};

export default Dashboard;
