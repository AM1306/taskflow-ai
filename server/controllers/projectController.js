const Project = require("../models/Project");
const Task = require("../models/Task");

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { title, description, status, deadline } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const project = await Project.create({
      title,
      description,
      status,
      deadline,
      owner: req.user.id,
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const { title, description, status, deadline } = req.body;
    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (status !== undefined) project.status = status;
    if (deadline !== undefined) project.deadline = deadline;

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ message: "Project and its tasks deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
