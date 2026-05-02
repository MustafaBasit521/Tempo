// =============================================
// FILE: src/routes/timetable_routes.js
// =============================================

const express = require("express");
const router = express.Router();

const controller = require("../controllers/timetable_controller");
const upload = require("../middleware/upload_middleware");
const { verifyToken } = require("../middleware/auth_middleware");
const { allowRoles } = require("../middleware/role_middleware");

// ONLY ADMIN CAN UPLOAD TIMETABLE FILE
router.post(
  "/upload",
  verifyToken,
  allowRoles("Admin"),
  upload.single("file"),
  controller.upload_timetable
);

module.exports = router;