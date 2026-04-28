const timetable_service = require("../services/timetable_service");

exports.upload_timetable = async (req, res) => {
  try {
    const filePath = req.file.path;

    const result = await timetable_service.process(filePath);

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};