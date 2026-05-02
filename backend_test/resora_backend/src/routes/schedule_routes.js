const express = require('express');
const router = express.Router();

const controller = require('../controllers/schedule_controller');

router.post('/', controller.insert_schedule);
router.get('/student/:id', controller.get_student_schedule);
router.get('/teacher/:id', controller.get_teacher_schedule);
router.get('/room/:id', controller.get_room_schedule);
router.get('/search', controller.class_locator);
router.get('/teachers', controller.get_all_teachers);

module.exports = router;