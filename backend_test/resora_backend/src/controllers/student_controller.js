// =============================================
// FILE: src/controllers/student_controller.js
// =============================================

const studentService = require("../services/student_service");

// =============================================
// GET FULL TIMETABLE
// =============================================

// exports.get_student_timetable = async (req, res) => {
//   try {
//     const student_id = req.user.reference_id;

//     const result = await studentService.get_student_timetable(
//       student_id
//     );

//     if (!result || !result.length) {
//       return res.status(404).json({
//         error: "No timetable found"
//       });
//     }

//     res.json(result);

//   } catch (err) {
//     res.status(500).json({
//       error: err.message
//     });
//   }
// };
exports.get_student_timetable = async (req, res) => {
  try {
    const student_id = req.user.reference_id;

    // 🔥 Print student ID
    console.log("Student ID:", student_id);

    const result = await studentService.get_student_timetable(
      student_id
    );

    if (!result || !result.length) {
      return res.status(404).json({
        error: "No timetable found"
      });
    }

    res.json(result);

  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({
      error: err.message
    });
  }
};

// =============================================
// FIND CURRENT CLASS
// =============================================

exports.find_my_class = async (req, res) => {
  try {
    const student_id = req.user.reference_id;

    const result = await studentService.find_my_class(
      student_id
    );

    res.json(result);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};