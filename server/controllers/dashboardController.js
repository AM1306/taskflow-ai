const Project = require("../models/Project");
const Task = require("../models/Task");

exports.getStats = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id });
    const projectIds = projects.map((p) => p._id);
    const tasks = await Task.find({ project: { $in: projectIds } });

    const now = new Date();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "done").length;
    const inProgressTasks = tasks.filter(
      (t) => t.status === "in-progress",
    ).length;
    const todoTasks = tasks.filter((t) => t.status === "todo").length;
    const overdueTasks = tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "done",
    ).length;

    // tasks completed per day, last 14 days
    const last14Days = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const count = tasks.filter(
        (t) =>
          t.completedAt &&
          new Date(t.completedAt).toISOString().split("T")[0] === dateStr,
      ).length;
      last14Days.push({ date: dateStr, completed: count });
    }

    // per-project completion percentage
    const projectStats = projects.map((project) => {
      const projectTasks = tasks.filter(
        (t) => t.project.toString() === project._id.toString(),
      );
      const done = projectTasks.filter((t) => t.status === "done").length;
      const completionPercent =
        projectTasks.length > 0
          ? Math.round((done / projectTasks.length) * 100)
          : 0;
      return {
        _id: project._id,
        title: project.title,
        status: project.status,
        deadline: project.deadline,
        taskCount: projectTasks.length,
        completionPercent,
      };
    });

    res.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks,
      tasksByStatus: [
        { status: "todo", count: todoTasks },
        { status: "in-progress", count: inProgressTasks },
        { status: "done", count: completedTasks },
      ],
      completedPerDay: last14Days,
      projects: projectStats,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
