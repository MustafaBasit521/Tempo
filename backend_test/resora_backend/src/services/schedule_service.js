const json_service = require("./json_service");
const transform_service = require("./transform_service");
const insert_service = require("./insert_service");

async function process_upload(filePath) {
  try {
    // =========================================
    // 1. Parse Excel Raw Matrix
    // =========================================
    const rawData = await json_service.parse_timetable(filePath);
    console.log("✅ Excel parsed successfully");

    const finalData = [];

    const startSlots = [
      "08:30:00",
      "10:00:00",
      "11:30:00",
      "13:00:00",
      "14:30:00",
      "16:00:00",
      "17:30:00",
      "19:00:00"
    ];

    const endSlots = [
      "10:00:00",
      "11:30:00",
      "13:00:00",
      "14:30:00",
      "16:00:00",
      "17:30:00",
      "19:00:00",
      "20:30:00"
    ];

    let currentDay = null;

    // =========================================
    // 2. Matrix → Structured JSON
    // =========================================
    for (let i = 3; i < rawData.rows.length; i++) {
      const row = rawData.rows[i];

      if (!row || row.length < 3) continue;

      if (row[0]) {
        currentDay = row[0];
      }

      const room = row[1];

      if (!room || !currentDay) continue;

      for (let col = 2; col < row.length; col++) {
        const cellValue = row[col];

        if (!cellValue || typeof cellValue !== "string") continue;

        const slotIndex = Math.floor((col - 2) / 9);

        if (slotIndex >= startSlots.length) continue;

        const parsed = transform_service.extractData(
          cellValue,
          room,
          currentDay,
          startSlots[slotIndex],
          endSlots[slotIndex]
        );

        if (parsed) {
          finalData.push(parsed);
        }
      }
    }

    console.log(`✅ Final Records: ${finalData.length}`);

    // =========================================
    // 3. Insert Into Database
    // =========================================
    const result = await insert_service.insert_all(finalData);

    console.log("✅ Data inserted successfully");

    return result;

  } catch (err) {
    throw new Error(
      "Schedule processing failed: " + err.message
    );
  }
}

async function get_student_schedule(student_id) {
  const student = await insert_service.get_student_info(student_id);

  if (!student) return null;

  const { section, batch_year, department_id } = student;

  return insert_service.get_by_student(
    section,
    batch_year,
    department_id
  );
}

async function get_teacher_schedule(teacher_id) {
  return insert_service.get_by_teacher(teacher_id);
}

async function get_room_schedule(room_id) {
  return insert_service.get_by_room(room_id);
}

async function class_locator(filters) {
  return insert_service.search(filters);
}

// =========================================
// GET ALL TEACHERS
// =========================================
async function get_all_teachers() {
  return insert_service.get_all_teachers();
}

module.exports = {
  process_upload,
  get_student_schedule,
  get_teacher_schedule,
  get_room_schedule,
  class_locator,
  get_all_teachers
};