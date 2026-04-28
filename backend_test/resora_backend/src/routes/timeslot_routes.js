const express = require("express");
const router = express.Router();

const timeslot_controller = require("../controllers/timeslot_controller");

router.post("/", timeslot_controller.create_timeslot);
router.get("/", timeslot_controller.get_all_timeslots);
router.delete("/:id", timeslot_controller.delete_timeslot);

module.exports = router;