// app.js (TAM KOD - MongoDB, Session, Flash ve JSON Desteği)

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();

// Category Modelini dahil et
const Category = require('./models/categoryModel'); 

const PORT = 3000;
const MONGO_URI = 'mongodb://localhost:27017/todoApp'; 

// --- MongoDB Bağlantısı ---
mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('MongoDB bağlantısı başarılı!');
        
        // Varsayılan kategorileri başlat
        await Category.initializeCategories();
        console.log('Varsayılan kategoriler yüklendi.');
        
        app.listen(PORT, () => {
            console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor...`);
        });
    })
    .catch(err => {
        console.error('MongoDB bağlantı hatası:', err);
        console.log('Lütfen MongoDB sunucunuzun (mongod) çalıştığından emin olun.');
    });

// --- Middlewares ---

// 1. Standart Form verilerini okuma (POST formları için)
app.use(express.urlencoded({ extended: true })); 

// 🚨 KRİTİK: 2. JSON verilerini okuma (AJAX/Fetch API için)
app.use(express.json()); 

// 3. Statik dosyalar (CSS/JS) için
app.use(express.static(path.join(__dirname, 'public'))); 

// Session ve Flash Mesajları
app.use(session({
    secret: 'cok-gizli-anahtarim', 
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
app.use(flash()); 

// Global Mesajları Ayarlama Middleware'i
app.use((req, res, next) => {
    res.locals.successMessage = req.flash('success');
    res.locals.errorMessage = req.flash('error');
    next();
});


// View Engine ayarları
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

// --- Route Importları ---
const adminRoutes = require('./routes/admin'); 
const publicRoutes = require('./routes/public');
const authRoutes = require('./routes/auth');

// --- Route Kullanımı ---
app.use(authRoutes);
app.use(publicRoutes);
app.use(adminRoutes);