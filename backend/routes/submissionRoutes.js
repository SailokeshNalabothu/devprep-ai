const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  runCodeOnly,
  submitCode,
  getUserSubmissions
} = require("../controllers/submissionController");


router.post("/run", authMiddleware, runCodeOnly);

router.post("/submit", authMiddleware, submitCode);

router.get("/my-submissions", authMiddleware, getUserSubmissions);


module.exports = router;