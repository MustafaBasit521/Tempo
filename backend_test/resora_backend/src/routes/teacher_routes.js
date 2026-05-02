// =============================================
// FILE: src/routes/teacher_routes.js
// =============================================

const express = require("express");
const router = express.Router();

const controller = require("../controllers/teacher_controller");
const { verifyToken } = require("../middleware/auth_middleware");
const { allowRoles } = require("../middleware/role_middleware");

// SEARCH FREE ROOMS
router.get(
  "/available-rooms",
  verifyToken,
  allowRoles("Teacher"),
  controller.search_available_rooms
);

// BOOK ROOM REQUEST
router.post(
  "/book-room",
  verifyToken,
  allowRoles("Teacher"),
  controller.book_room
);

// MY BOOKINGS
router.get(
  "/my-bookings",
  verifyToken,
  allowRoles("Teacher"),
  controller.get_my_bookings
);

module.exports = router;