const express = require("express");
const router = express.Router();

const {
  addQuestion,
  getQuestions,
  deleteQuestion
} = require("../controllers/questionController");

// 🔐 Import middlewares
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/admin");


// ================= PUBLIC ROUTES =================
router.get("/", getQuestions);


// ================= ADMIN ROUTES =================

// Add question (admin only)
router.post("/add", auth, admin, addQuestion);

// Delete question (admin only)
router.delete("/:id", auth, admin, deleteQuestion);
router.put("/:id", auth, admin, updateQuestion);


module.exports = router;