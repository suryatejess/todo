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

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
