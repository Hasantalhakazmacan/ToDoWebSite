const express = require("express");
const todoController = require("../controllers/todoController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", (req, res, next) => {
  // Oturumda userId varsa, bir sonraki GET handler'a geç (next())
  if (req.session.userId) {
    return next();
  }
  // Oturum yoksa, Landing Page'i render et
  res.render("landing", { pageTitle: "Hoş Geldiniz" });
});

router.get("/", isAuthenticated, todoController.getTodosPage);

router.post("/", isAuthenticated, todoController.addTodoItem);
router.post("/delete/:id", isAuthenticated, todoController.deleteTodoItem);

router.post("/toggle/:id", isAuthenticated, todoController.toggleTodoItem);

router.put("/edit/:id", isAuthenticated, todoController.putTodoItem);

module.exports = router;
