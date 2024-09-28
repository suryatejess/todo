const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Todo = new Schema({
  title: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Todo", Todo);
