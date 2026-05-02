// =============================================
// FILE: src/controllers/admin_controller.js
// =============================================

const departmentService = require("../services/department_service");
const courseService = require("../services/course_service");
const teacherService = require("../services/teacher_service");
const studentService = require("../services/student_service");
const taService = require("../services/ta_service");
const roomService = require("../services/room_service");
const timetableService = require("../services/timetable_service");


// =============================================
// DEPARTMENT
// =============================================

exports.add_department = async (req, res) => {
  try {
    const result = await departmentService.create_department(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.get_all_departments = async (req, res) => {
  try {
    const result = await departmentService.get_all_departments();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.delete_department = async (req, res) => {
  try {
    const result = await departmentService.delete_department(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};


// =============================================
// TEACHER
// =============================================

exports.add_teacher = async (req, res) => {
  try {
    const result = await teacherService.createTeacher(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.get_all_teachers = async (req, res) => {
  try {
    const result = await teacherService.get_all_teachers();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.delete_teacher = async (req, res) => {
  try {
    const result = await teacherService.deleteTeacher(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};


// =============================================
// STUDENT
// =============================================

exports.add_student = async (req, res) => {
  try {
    const result = await studentService.createStudent(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.get_all_students = async (req, res) => {
  try {
    const result = await studentService.get_all_students();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.delete_student = async (req, res) => {
  try {
    const result = await studentService.deleteStudent(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};


// =============================================
// TA
// =============================================

exports.add_ta = async (req, res) => {
  try {
    const result = await taService.createTA(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.get_all_tas = async (req, res) => {
  try {
    const result = await taService.get_all_tas();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.delete_ta = async (req, res) => {
  try {
    const result = await taService.deleteTA(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};


// =============================================
// ROOM
// =============================================

exports.add_room = async (req, res) => {
  try {
    const result = await roomService.create_room(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.get_all_rooms = async (req, res) => {
  try {
    const result = await roomService.get_all_rooms();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.delete_room = async (req, res) => {
  try {
    const result = await roomService.delete_room(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};


// =============================================
// COURSE
// =============================================

exports.add_course = async (req, res) => {
  try {
    const result = await courseService.create_course(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.get_all_courses = async (req, res) => {
  try {
    const result = await courseService.get_all_courses();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.delete_course = async (req, res) => {
  try {
    const result = await courseService.delete_course(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};


// =============================================
// TIMETABLE
// =============================================

exports.upload_timetable = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded"
      });
    }

    const result = await timetableService.process(req.file.path);

    res.json(result);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};
// =============================================
// ADD THESE IN:
// FILE: src/controllers/admin_controller.js
// =============================================

const roomBookingService = require("../services/room_booking_service");

// GET ALL BOOKING REQUESTS
exports.get_all_booking_requests = async (req, res) => {
  try {
    const result =
      await roomBookingService.get_all_booking_requests();

    res.json(result);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

// APPROVE BOOKING
exports.approve_booking = async (req, res) => {
  try {
    const admin_user_id = req.user.user_id;

    const result =
      await roomBookingService.approve_booking(
        req.params.id,
        admin_user_id
      );

    res.json(result);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

// REJECT BOOKING
exports.reject_booking = async (req, res) => {
  try {
    const admin_user_id = req.user.user_id;

    const result =
      await roomBookingService.reject_booking(
        req.params.id,
        admin_user_id
      );

    res.json(result);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};