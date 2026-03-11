const User = require("../models/userModel"); 

// Oturum kontrolü yapan middleware
exports.isAuthenticated = async (req, res, next) => {
  if (!req.session.userId) {

    return res.redirect("/login");
  }


  try {
    
    const user = await User.findById(req.session.userId);

    if (!user) {
      
      req.session.destroy(() => {
        return res.redirect("/login");
      });
      return;
    }

    res.locals.user = user;

    next(); 
  } catch (err) {
    console.error("Kullanıcı bulma hatası:", err);
    return res.redirect("/login");
  }
};
