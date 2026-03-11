// controllers/adminController.js (GÜNCEL: POST ve DELETE fonksiyonları)

const Category = require("../models/categoryModel");
const { Todo } = require("../models/todoModel"); // Kategoriye ait görevleri silmek için Todo modeli gerekli

// POST /admin/categories - Yeni kategori ekle (AJAX/Fetch API için)
exports.postCategory = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Kategori adı boş bırakılamaz." });
  }

  try {
    const newCategory = new Category({ name: name.trim() });
    const savedCategory = await newCategory.save();

    res.status(201).json({
      success: true,
      category: savedCategory,
      message: `${savedCategory.name} kategorisi başarıyla eklendi.`,
    });
  } catch (error) {
    let errorMessage = "Kategori eklenirken bir hata oluştu.";

    if (error.code === 11000) {
      errorMessage = "Bu kategori zaten mevcut.";
    }

    res.status(409).json({ success: false, message: errorMessage });
  }
};

// 🚨 YENİ FONKSİYON: Kategori Silme
// DELETE /admin/categories/:id - Kategori silme (AJAX/Fetch API için)
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Kategoriyi sil
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Kategori bulunamadı." });
    }

    // 2. Bu kategoriye ait tüm görevleri de sil (Önerilir)
    await Todo.deleteMany({ category: deletedCategory.name });

    res.status(200).json({
      success: true,
      message: `${deletedCategory.name} kategorisi başarıyla silindi.`,
      categoryId: id,
    });
  } catch (error) {
    console.error("Kategori silinirken hata:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Kategori silinirken beklenmeyen bir hata oluştu.",
      });
  }
};
