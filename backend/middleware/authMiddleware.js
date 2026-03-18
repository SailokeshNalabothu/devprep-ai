const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  const authHeader = req.headers.authorization;

  // Check if header exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token provided"
    });
  }

  // Extract token
  const token = authHeader.split(" ")[1];

  try {

    // Verify token using environment variable
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secretkey"
    );

    // Attach user info (id + role)
    req.user = decoded;

    next();

  } catch (error) {

    console.error("Auth error:", error.message);

    return res.status(401).json({
      message: "Invalid token"
    });

  }

};

module.exports = authMiddleware;