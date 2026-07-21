require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

const app = express();

// ✅ UPDATE CORS TO ALLOW YOUR VERCEL FRONTEND
app.use(
  cors({
    origin: [
      "https://taskflow-ai-eosin-three.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`📩 Incoming Request: ${req.method} ${req.url}`);
  next();
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/chat", require("./routes/chat"));

app.get("/", (req, res) => {
  res.send("TaskFlow AI API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
