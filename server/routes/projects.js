const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

router.use(protect);
router.get("/", getProjects);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
