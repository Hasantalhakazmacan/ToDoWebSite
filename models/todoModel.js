// models/todoModel.js

const mongoose = require("mongoose");

// Şema Tanımı
const todoSchema = new mongoose.Schema({
  // 1. KULLANICI ID'Sİ (Zorunlu Bağlantı)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  // 2. KATEGORİ ALANI (Dinamik kategori adı)
  category: {
    type: String,
    required: true, // ⬅️ Bu alanın zorunlu olması gerekiyor
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

// --- CRUD OPERASYONLARI ---

// 1. READ: Listeleme ve Filtreleme
exports.getAllTodos = async (userId, categoryFilter, hideCompleted) => {
  // Temel sorgu: Her zaman kullanıcı ID'sine göre filtrele
  const query = { userId: userId };

  // Kategori filtresi varsa sorguya ekle
  if (categoryFilter) {
    query.category = categoryFilter;
  }

  // Tamamlananları gizleme filtresi varsa ekle
  if (hideCompleted === "true") {
    query.completed = false;
  }

  return await Todo.find(query).sort({ createdAt: 1 });
};

// 2. CREATE: Yeni iş ekleme
exports.addTodo = async (title, userId, category) => {
  const newTodo = new Todo({
    title: title,
    userId: userId,
    category: category || "Diğer", // Kategori değeri kontrol edilir
  });
  return await newTodo.save();
};

// 3. DELETE: İş silme
exports.deleteTodo = async (id, userId) => {
  const result = await Todo.findOneAndDelete({ _id: id, userId: userId });
  return result;
};

// 4. UPDATE: Durum değiştirme
exports.toggleCompleted = async (id, userId) => {
  const todo = await Todo.findOne({ _id: id, userId: userId });

  if (todo) {
    todo.completed = !todo.completed;
    await todo.save();
    return true;
  }
  return false;
};

// 5. UPDATE: Görev başlık ve kategori güncelleme
exports.updateTodo = async (id, userId, title, category) => {
  const result = await Todo.findOneAndUpdate(
    { _id: id, userId: userId },
    { title: title.trim(), category: category },
    { new: true }
  );
  return result;
};

// Export the Mongoose model itself for direct model operations (e.g., deleteMany)
exports.Todo = Todo;
