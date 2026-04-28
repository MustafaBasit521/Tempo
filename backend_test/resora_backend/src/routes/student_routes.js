// =============================================
// FILE: src/routes/student_routes.js
// =============================================

const express = require("express");
const router = express.Router();

const controller = require("../controllers/student_controller");
const { verifyToken } = require("../middleware/auth_middleware");
const { allowRoles } = require("../middleware/role_middleware");

// =============================================
// VIEW FULL TIMETABLE
// =============================================

router.get(
  "/timetable",
  verifyToken,
  allowRoles("Student"),
  controller.get_student_timetable
);


// =============================================
// FIND CURRENT CLASS
// =============================================

router.get(
  "/find-class",
  verifyToken,
  allowRoles("Student"),
  controller.find_my_class
);

module.exports = router;