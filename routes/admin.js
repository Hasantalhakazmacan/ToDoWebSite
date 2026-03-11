const express = require("express");
const adminController = require("../controllers/adminController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/admin/categories", isAuthenticated, adminController.postCategory);

router.delete(
  "/admin/categories/:id",
  isAuthenticated,
  adminController.deleteCategory,
);

module.exports = router;
