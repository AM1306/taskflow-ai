const Task = require("../models/Task");
const Project = require("../models/Project");

// helper: verify the project belongs to this user
const verifyProjectOwnership = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, owner: userId });
  return project;
};

exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;
    if (!projectId)
      return res
        .status(400)
        .json({ message: "projectId query param is required" });

    const project = await verifyProjectOwnership(projectId, req.user.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const tasks = await Task.find({ project: projectId }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, project, priority, dueDate } = req.body;
    if (!title || !project) {
      return res
        .status(400)
        .json({ message: "Title and project are required" });
    }

    const projectDoc = await verifyProjectOwnership(project, req.user.id);
    if (!projectDoc)
      return res.status(404).json({ message: "Project not found" });

    const task = await Task.create({
      title,
      description,
      project,
      priority,
      dueDate,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("project");
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.project.owner.toString() !== req.user.id) {
      return res.status(404).json({ message: "Task not found" });
    }

    const { title, description, status, priority, dueDate } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (status !== undefined) {
      task.status = status;
      task.completedAt = status === "done" ? new Date() : null;
    }

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("project");
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.project.owner.toString() !== req.user.id) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
