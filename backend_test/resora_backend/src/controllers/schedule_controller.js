const svc = require('../services/schedule_service');

// INSERT
async function insert_schedule(req, res) {
  try {
    const result = await svc.process_upload(req.body);

    res.status(201).json({
      inserted: result.length,
      records: result
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}

// STUDENT
async function get_student_schedule(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "Invalid ID"
      });
    }

    const data = await svc.get_student_schedule(id);

    if (!data) {
      return res.status(404).json({
        error: "Student not found"
      });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}

// TEACHER
async function get_teacher_schedule(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "Invalid ID"
      });
    }

    const data = await svc.get_teacher_schedule(id);
    res.json(data);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}

// ROOM
async function get_room_schedule(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "Invalid ID"
      });
    }

    const data = await svc.get_room_schedule(id);
    res.json(data);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}

// SEARCH
async function class_locator(req, res) {
  try {
    const data = await svc.class_locator(req.query);
    res.json(data);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}

// GET ALL TEACHERS
async function get_all_teachers(req, res) {
  try {
    const teachers = await svc.get_all_teachers();

    res.json({
      success: true,
      data: teachers
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}

module.exports = {
  insert_schedule,
  get_student_schedule,
  get_teacher_schedule,
  get_room_schedule,
  class_locator,
  get_all_teachers
};