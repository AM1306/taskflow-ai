const { GoogleGenerativeAI } = require("@google/generative-ai");
const Project = require("../models/project");
const Task = require("../models/task");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message)
      return res.status(400).json({ message: "Message is required" });

    const projects = await Project.find({ owner: req.user.id });
    const projectIds = projects.map((p) => p._id);
    const tasks = await Task.find({ project: { $in: projectIds } }).populate(
      "project",
      "title",
    );

    const totalTasks = tasks.length;
    const doneTasks = tasks.filter((t) => t.status === "done").length;
    const inProgressTasks = tasks.filter(
      (t) => t.status === "in-progress",
    ).length;
    const overdueTasks = tasks.filter(
      (t) =>
        t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done",
    );

    const projectSummaries = projects
      .map((p) => {
        // Safe check for t.project existence
        const pTasks = tasks.filter(
          (t) => t.project && t.project._id.toString() === p._id.toString(),
        );
        const pending = pTasks.filter((t) => t.status !== "done").length;
        return `- "${p.title}": ${pTasks.length} tasks total, ${pending} pending`;
      })
      .join("\n");

    const overdueList =
      overdueTasks
        .map(
          (t) =>
            `- "${t.title}" (project: ${t.project?.title || "Unassigned"}, due: ${new Date(t.dueDate).toLocaleDateString()})`,
        )
        .join("\n") || "None";

    const context = `
User has ${projects.length} project(s) and ${totalTasks} task(s) total.
Status breakdown: ${doneTasks} done, ${inProgressTasks} in progress, ${totalTasks - doneTasks - inProgressTasks} to do.
Overdue tasks (${overdueTasks.length}):
${overdueList}

Projects:
${projectSummaries || "No projects yet"}
`.trim();

    // FIXED: Changed to valid model name "gemini-1.5-flash"
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a helpful productivity assistant for a task management app called TaskFlow AI. Answer the user's question using ONLY the data provided below. Be concise and specific — reference actual task/project names and numbers. Do not make up data not shown here.

DATA:
${context}

USER QUESTION: ${message}`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (err) {
    // ALWAYS print to console so errors show in Render logs!
    console.error("🔴 CHAT ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
