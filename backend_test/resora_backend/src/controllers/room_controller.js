const room_service = require("../services/room_service");

exports.create_room = async (req, res) => {
  try {
    const result = await room_service.create_room(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.get_all_rooms = async (req, res) => {
  try {
    const data = await room_service.get_all_rooms();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete_room = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await room_service.delete_room(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};