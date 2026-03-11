// middlewares/authMiddleware.js (GÜNCELLENMİŞ: Kullanıcı Bilgisini Çekme)

const User = require("../models/userModel"); // User modelini dahil et

// Oturum kontrolü yapan middleware
exports.isAuthenticated = async (req, res, next) => {
  // 🚨 1. ADIM: Oturum kontrolü
  // Eğer oturumda userId yoksa, bu middleware'in Route'a eklenmiş olması yetkili erişim gerektirdiği anlamına gelir.
  if (!req.session.userId) {
    // public.js'teki logic artık giriş yapılmamışsa '/login'e yönlendirdiği için,
    // bu kod aslında sadece kritik CRUD işlemleri için çalışır.
    return res.redirect("/login");
  }

  // 🚨 2. ADIM: Kullanıcı Bilgisini Çekme
  try {
    // Kullanıcı ID'si ile veritabanından kullanıcıyı bul
    const user = await User.findById(req.session.userId);

    if (!user) {
      // Kullanıcı veritabanında yoksa, oturumu sonlandır
      req.session.destroy(() => {
        return res.redirect("/login");
      });
      return;
    }

    // 🚨 3. ADIM: Bilgiyi View'e aktarma (res.locals)
    // View'lerde ve Controller'larda kullanmak üzere kullanıcı objesini atıyoruz.
    // Bu sayede anasayfa.ejs'te <%= user.username %> olarak erişebiliriz.
    res.locals.user = user;

    next(); // Tüm kontroller başarılı, bir sonraki işleme (Controller'a) geç
  } catch (err) {
    console.error("Kullanıcı bulma hatası:", err);
    return res.redirect("/login");
  }
};
