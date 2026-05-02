const department_service = require("../services/department_service");

// CREATE
exports.create_department = async (req, res) => {
  try {
    const result = await department_service.create_department(req.body);

    res.status(201).json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
exports.get_all_departments = async (req, res) => {
  try {
    const data = await department_service.get_all_departments();

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.delete_department = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await department_service.delete_department(id);

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};