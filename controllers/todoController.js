const todoModel = require("../models/todoModel");
const categoryModel = require("../models/categoryModel"); // Category Modelini dahil et

exports.getTodosPage = async (req, res) => {
  try {
    const userId = req.session.userId;
    const categoryFilter = req.query.category;
    const hideCompleted = req.query.hideCompleted;
    const allCategories = await categoryModel.getAllCategories();
    const todoList = await todoModel.getAllTodos(
      userId,
      categoryFilter,
      hideCompleted
    );

    res.render("anasayfa", {
      pageTitle: "Yapılacaklar Listesi",
      todos: todoList,
      currentCategory: categoryFilter || "",
      hideCompleted: hideCompleted,
      categories: allCategories, 
    });
  } catch (error) {
    console.error("Veri okuma hatası:", error);
    req.flash("error", "Görevler yüklenirken bir sorun oluştu.");
    res.status(500).render("anasayfa", {
      pageTitle: "Hata",
      todos: [],
      currentCategory: "",
      hideCompleted: undefined,
      categories: [], 
    });
  }
};


exports.addTodoItem = async (req, res) => {
  const { title, category } = req.body;
  const userId = req.session.userId;

  if (title && title.trim().length > 0) {
    try {
      await todoModel.addTodo(title, userId, category);
      req.flash("success", "Yeni görev başarıyla eklendi!");
    } catch (error) {
      console.error("MongoDB Ekleme Hatası Detayı:", error);
      req.flash("error", "Ekleme sırasında bir hata oluştu.");
    }
  } else {
    req.flash("error", "Görev başlığı boş bırakılamaz.");
  }
  res.redirect("/");
};

exports.deleteTodoItem = async (req, res) => {
  const todoId = req.params.id;
  const userId = req.session.userId;

  try {
    const deletedItem = await todoModel.deleteTodo(todoId, userId);
    if (deletedItem) {
      req.flash("success", "Görev başarıyla silindi.");
    } else {
      req.flash("error", "Silinecek görev bulunamadı veya yetkiniz yok.");
    }
  } catch (error) {
    console.error("Silme hatası:", error);
    req.flash("error", "Silme sırasında bir hata oluştu.");
  }
  res.redirect("/");
};

exports.toggleTodoItem = async (req, res) => {
  const todoId = req.params.id;
  const userId = req.session.userId;

  try {
    const updated = await todoModel.toggleCompleted(todoId, userId);
    if (updated) {
      // BAŞARI MESAJI
      req.flash("success", "Görev durumu güncellendi.");
    } else {
      req.flash("error", "Güncellenecek görev bulunamadı veya yetkiniz yok.");
    }
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    req.flash("error", "Güncelleme sırasında bir hata oluştu.");
  }
  res.redirect("/");
};

exports.putTodoItem = async (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;
  const { title, category } = req.body;
  if (!title || title.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Başlık boş bırakılamaz." });
  }

  try {
    const userId = req.session.userId;
    const updatedTodo = await todoModel.updateTodo(id, userId, title, category);

    if (!updatedTodo) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Görev bulunamadı veya yetkiniz yok.",
        });
    }

    res.status(200).json({
      success: true,
      message: "Görev başarıyla güncellendi.",
      todo: updatedTodo, 
    });
  } catch (error) {
    console.error("Görev güncellenirken hata:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Görev güncellenirken beklenmeyen bir hata oluştu.",
      });
  }
};
