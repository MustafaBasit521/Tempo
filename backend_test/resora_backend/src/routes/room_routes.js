const express = require("express");
const router = express.Router();

const room_controller = require("../controllers/room_controller");

router.post("/", room_controller.create_room);
router.get("/", room_controller.get_all_rooms);
router.delete("/:id", room_controller.delete_room);

module.exports = router;