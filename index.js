const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Todo = require("./models/Todo");
const port = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/todo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.post("/new", async (req, res) => {
  const { todoName, todoDeadline } = req.body;
  console.log("New To-Do Name:", todoName);
  console.log("New To-Do Deadline:", todoDeadline);
  // Here you can add logic to save the todoName to your database or array
  // Create a new Todo document
  const newTodo = new Todo({
    title: todoName,
    deadline: todoDeadline,
  });

  await newTodo.save();
  console.log("To-Do saved successfully!");
  res.redirect("/");

  //   res.send(todoName + " " + todoDeadline); // Send the todoName back to the client
  //   res.redirect("/"); // Redirect back to the main page or another route
});

// Add a new route to display all the To-Dos
app.get("/show", async (req, res) => {
  const todos = await Todo.find({});
  res.render("show", { todos });
});

// Add a new route to display a single To-Do
app.get("/show/:id", async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findById(id);
  res.render("showSingle", { todo });
});

// Assuming you're using Mongoose with MongoDB
app.patch("/todo/:id", async (req, res) => {
  const todoId = req.params.id;
  const { completed } = req.body;

  try {
    // Update the completed status of the todo item
    await Todo.findByIdAndUpdate(todoId, { completed: completed });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update todo" });
  }
});

// Add a new route to delete a To-Do
app.delete("/todo/:id", async (req, res) => {
  const todoId = req.params.id;

  try {
    // Delete the todo item
    await Todo.findByIdAndDelete(todoId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete todo" });
  }
});
// Add a new route to update a To-Do

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
