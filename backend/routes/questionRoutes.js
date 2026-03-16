const express = require("express");
const router = express.Router();

const {
  addQuestion,
  getQuestions,
  deleteQuestion
} = require("../controllers/questionController");


router.get("/", getQuestions);

router.post("/add", addQuestion);

router.delete("/:id", deleteQuestion);

module.exports = router;