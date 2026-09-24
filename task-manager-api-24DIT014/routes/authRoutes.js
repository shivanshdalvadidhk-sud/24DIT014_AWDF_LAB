const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { register, login, getMe } = require("../controllers/authController");

// Public authentication routes
router.post("/register", register);
router.post("/login", login);

// Protected user route
router.get("/me", auth, getMe);

module.exports = router;
