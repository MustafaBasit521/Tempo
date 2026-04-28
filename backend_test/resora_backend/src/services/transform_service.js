function normalizeDay(day) {
  if (!day) return null;

  const dayMap = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",

    Monday: "Monday",
    Tuesday: "Tuesday",
    Wednesday: "Wednesday",
    Thursday: "Thursday",
    Friday: "Friday"
  };

  return dayMap[day.trim()] || null;
}

// 🔥 Generate short course code
// Example:
// Secure Cloud Computing → SCC
// Object Oriented Programming → OOP
function generateCourseCode(courseName, section) {
  if (!courseName) return null;

  // Take first letter of each word
  const initials = courseName
    .trim()
    .split(/\s+/)
    .map(word => word[0]?.toUpperCase())
    .join("");

  // semester from section like BCS-6A → 6
  const semester =
    parseInt(section.match(/\d+/)?.[0]) || 1;

  // final format
  return `${initials}-${semester}01`;

  // Example:
  // SCC-601
  // OOP-201
  // DB-401
}

function extractData(cellValue, room, day, startTime, endTime) {
  if (!cellValue || typeof cellValue !== "string") return null;

  /**
   * Example:
   * OOP (BSE-2A): Hina I
   */

  const regex = /(.+?)\s*\((.+?)\)\s*:\s*(.*)/;
  const match = cellValue.match(regex);

  if (!match) return null;

  const course_name = match[1].trim();
  const section = match[2].trim();
  const teacher_name = match[3].trim() || null;

  // department = first part of section
  const department_name = section.split("-")[0];

  // normalize day for DB constraint
  const normalizedDay = normalizeDay(day);

  // 🔥 short course code
  const course_code = generateCourseCode(
    course_name,
    section
  );

  const batch_year = 2025;

  return {
    department_name,
    course_name,
    course_code,
    teacher_name,
    room_number: room,
    day: normalizedDay,
    start_time: startTime,
    end_time: endTime,
    section,
    batch_year
  };
}

module.exports = {
  extractData
};