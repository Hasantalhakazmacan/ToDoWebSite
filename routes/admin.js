// routes/admin.js (GÜNCEL: POST ve DELETE route'ları)

const express = require('express');
const adminController = require('../controllers/adminController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

const router = express.Router();

// Kategori Ekleme (POST)
// Bu route, Side Paneldeki JavaScript (Fetch API) tarafından çağrılır.
router.post('/admin/categories', isAuthenticated, adminController.postCategory); 

// 🚨 YENİ: Kategori Silme (DELETE)
// Buradaki :id parametresi, silinecek kategorinin MongoDB ID'sini taşır.
router.delete('/admin/categories/:id', isAuthenticated, adminController.deleteCategory); 

module.exports = router;