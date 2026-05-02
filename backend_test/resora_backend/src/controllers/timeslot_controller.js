const timeslot_service = require("../services/timeslot_service");

// CREATE
exports.create_timeslot = async (req, res) => {
  try {
    const result = await timeslot_service.create_timeslot(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
exports.get_all_timeslots = async (req, res) => {
  try {
    const data = await timeslot_service.get_all_timeslots();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.delete_timeslot = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await timeslot_service.delete_timeslot(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};