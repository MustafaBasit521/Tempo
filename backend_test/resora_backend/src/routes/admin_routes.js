// =============================================
// FILE: src/routes/admin_routes.js
// =============================================

const express = require("express");
const router = express.Router();

const controller = require("../controllers/admin_controller");
const { verifyToken } = require("../middleware/auth_middleware");
const { allowRoles } = require("../middleware/role_middleware");


// =============================================
// DEPARTMENT
// =============================================

router.post(
  "/department",
  verifyToken,
  allowRoles("Admin"),
  controller.add_department
);

router.get(
  "/departments",
  verifyToken,
  allowRoles("Admin"),
  controller.get_all_departments
);

router.delete(
  "/department/:id",
  verifyToken,
  allowRoles("Admin"),
  controller.delete_department
);


// =============================================
// TEACHER
// =============================================

router.post(
  "/teacher",
  verifyToken,
  allowRoles("Admin"),
  controller.add_teacher
);

router.get(
  "/teachers",
  verifyToken,
  allowRoles("Admin"),
  controller.get_all_teachers
);

router.delete(
  "/teacher/:id",
  verifyToken,
  allowRoles("Admin"),
  controller.delete_teacher
);


// =============================================
// STUDENT
// =============================================

router.post(
  "/student",
  verifyToken,
  allowRoles("Admin"),
  controller.add_student
);

router.get(
  "/students",
  verifyToken,
  allowRoles("Admin"),
  controller.get_all_students
);

router.delete(
  "/student/:id",
  verifyToken,
  allowRoles("Admin"),
  controller.delete_student
);


// =============================================
// TA
// =============================================

router.post(
  "/ta",
  verifyToken,
  allowRoles("Admin"),
  controller.add_ta
);

router.get(
  "/tas",
  verifyToken,
  allowRoles("Admin"),
  controller.get_all_tas
);

router.delete(
  "/ta/:id",
  verifyToken,
  allowRoles("Admin"),
  controller.delete_ta
);


// =============================================
// ROOM
// =============================================

router.post(
  "/room",
  verifyToken,
  allowRoles("Admin"),
  controller.add_room
);

router.get(
  "/rooms",
  verifyToken,
  allowRoles("Admin"),
  controller.get_all_rooms
);

router.delete(
  "/room/:id",
  verifyToken,
  allowRoles("Admin"),
  controller.delete_room
);


// =============================================
// COURSE
// =============================================

router.post(
  "/course",
  verifyToken,
  allowRoles("Admin"),
  controller.add_course
);

router.get(
  "/courses",
  verifyToken,
  allowRoles("Admin"),
  controller.get_all_courses
);

router.delete(
  "/course/:id",
  verifyToken,
  allowRoles("Admin"),
  controller.delete_course
);


// =============================================
// TIMETABLE UPLOAD
// =============================================

router.post(
  "/timetable/upload",
  verifyToken,
  allowRoles("Admin"),
  controller.upload_timetable
);


// =============================================
// ROOM BOOKING REQUESTS
// =============================================

// GET ALL ROOM BOOKING REQUESTS
router.get(
  "/room-bookings",
  verifyToken,
  allowRoles("Admin"),
  controller.get_all_booking_requests
);

// APPROVE BOOKING
router.put(
  "/room-booking/:id/approve",
  verifyToken,
  allowRoles("Admin"),
  controller.approve_booking
);

// REJECT BOOKING
router.put(
  "/room-booking/:id/reject",
  verifyToken,
  allowRoles("Admin"),
  controller.reject_booking
);

module.exports = router;