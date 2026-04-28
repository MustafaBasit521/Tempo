const express = require("express");
const router = express.Router();

const course_controller = require("../controllers/course_controller");

router.post("/", course_controller.create_course);
router.get("/", course_controller.get_all_courses);
router.delete("/:code", course_controller.delete_course);

module.exports = router;