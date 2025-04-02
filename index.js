const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;
// Connect to MongoDB
mongoose
  .connect("mongodb+srv://jithin:jithin@cluster0.b2mly.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Define Task Schema
const taskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
  date: { type: Date, default: Date.now }
});

const Task = mongoose.model("Task", taskSchema);

// Create a task
app.post("/tasks", async (req, res) => {
  const { text } = req.body;
  const newTask = new Task({ text, completed: false });
  await newTask.save();
  res.json(newTask);
});

// Get all tasks
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Update a task
app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;
  const updatedTask = await Task.findByIdAndUpdate(id, { text, completed }, { new: true });
  res.json(updatedTask);
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  res.json({ message: "Task deleted" });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
