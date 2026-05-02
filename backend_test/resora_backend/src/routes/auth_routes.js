// =============================================
// FILE: src/routes/auth_routes.js
// =============================================

const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth_controller");
const { verifyToken } = require("../middleware/auth_middleware");

// LOGIN
router.post(
  "/login",
  controller.login
);

// LOGOUT
router.post(
  "/logout",
  verifyToken,
  controller.logout
);

// GET CURRENT USER
router.get(
  "/me",
  verifyToken,
  controller.get_me
);

module.exports = router;