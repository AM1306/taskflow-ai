const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["active", "completed", "on-hold"],
    default: "active",
  },
  deadline: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", projectSchema);
