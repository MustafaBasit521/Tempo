const express = require("express");
const router = express.Router();

const department_controller = require("../controllers/department_controller");

// CREATE
router.post("/", department_controller.create_department);

// GET ALL
router.get("/", department_controller.get_all_departments);

// DELETE
router.delete("/:id", department_controller.delete_department);

module.exports = router;