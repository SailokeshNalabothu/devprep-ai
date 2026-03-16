const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile", authMiddleware, (req, res) => {

  res.json({
    message: "Welcome to your profile",
    userId: req.user.id
  });

});

module.exports = router;