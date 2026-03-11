const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true, 
    default: "Diğer",
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Todo = mongoose.model("Todo", todoSchema);


exports.getAllTodos = async (userId, categoryFilter, hideCompleted) => {

  const query = { userId: userId };

  
  if (categoryFilter) {
    query.category = categoryFilter;
  }

  
  if (hideCompleted === "true") {
    query.completed = false;
  }

  return await Todo.find(query).sort({ createdAt: 1 });
};


exports.addTodo = async (title, userId, category) => {
  const newTodo = new Todo({
    title: title,
    userId: userId,
    category: category || "Diğer", 
  });
  return await newTodo.save();
};


exports.deleteTodo = async (id, userId) => {
  const result = await Todo.findOneAndDelete({ _id: id, userId: userId });
  return result;
};


exports.toggleCompleted = async (id, userId) => {
  const todo = await Todo.findOne({ _id: id, userId: userId });

  if (todo) {
    todo.completed = !todo.completed;
    await todo.save();
    return true;
  }
  return false;
};


exports.updateTodo = async (id, userId, title, category) => {
  const result = await Todo.findOneAndUpdate(
    { _id: id, userId: userId },
    { title: title.trim(), category: category },
    { new: true }
  );
  return result;
};

exports.Todo = Todo;
