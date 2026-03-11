// routes/public.js (Landing Page, Güvenlik Kontrolü ve GÖREV DÜZENLEME)

const express = require('express');
const todoController = require('../controllers/todoController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

const router = express.Router();

// 🚨 1. KÖK DİZİN (LANDING PAGE VEYA TO-DO LİSTESİ)
router.get('/', (req, res, next) => {
    // Oturumda userId varsa, bir sonraki GET handler'a geç (next())
    if (req.session.userId) {
        return next(); 
    }
    // Oturum yoksa, Landing Page'i render et
    res.render('landing', { pageTitle: 'Hoş Geldiniz' });
});

// 🚨 2. LİSTELEME (isAuthenticated Middleware'i ile korunur)
// Eğer 1. adımdaki if bloğundan gelirse (next() ile), bu handler çalışır.
router.get('/', isAuthenticated, todoController.getTodosPage); 

// --- DİĞER CRUD İŞLEMLERİ (Hepsi Giriş Yapmış Kullanıcı İçin Zorunlu) ---

// 3. CREATE: Ekleme
router.post('/', isAuthenticated, todoController.addTodoItem);  

// 4. DELETE: Silme
router.post('/delete/:id', isAuthenticated, todoController.deleteTodoItem);

// 5. UPDATE: Durum değiştirme
router.post('/toggle/:id', isAuthenticated, todoController.toggleTodoItem); 

// 🚨 YENİ: GÖREV DÜZENLEME/GÜNCELLEME (PUT Metodu)
// Bu route, views/anasayfa.ejs içindeki JavaScript (Fetch API) tarafından çağrılacaktır.
router.put('/edit/:id', isAuthenticated, todoController.putTodoItem); 

module.exports = router;