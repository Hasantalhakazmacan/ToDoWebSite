const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();
const Category = require("./models/categoryModel");
const PORT = 3000;
const MONGO_URI = "mongodb://localhost:27017/todoApp";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB bağlantısı başarılı!");
    await Category.initializeCategories();
    console.log("Varsayılan kategoriler yüklendi.");
    app.listen(PORT, () => {
      console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor...`);
    });
  })
  .catch((err) => {
    console.error("MongoDB bağlantı hatası:", err);
    console.log("Lütfen MongoDB sunucunuzun (mongod) çalıştığından emin olun.");
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "cok-gizli-anahtarim",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  }),
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.successMessage = req.flash("success");
  res.locals.errorMessage = req.flash("error");
  next();
});
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const adminRoutes = require("./routes/admin");
const publicRoutes = require("./routes/public");
const authRoutes = require("./routes/auth");

app.use(authRoutes);
app.use(publicRoutes);
app.use(adminRoutes);
