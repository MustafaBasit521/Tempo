const course_service = require("../services/course_service");

exports.create_course = async (req, res) => {
  try {
    const result = await course_service.create_course(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.get_all_courses = async (req, res) => {
  try {
    const data = await course_service.get_all_courses();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete_course = async (req, res) => {
  try {
    const { code } = req.params;
    const result = await course_service.delete_course(code);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};