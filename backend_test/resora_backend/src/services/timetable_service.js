const json_service = require("./json_service");
const transform_service = require("./transform_service");
const insert_service = require("./insert_service");

exports.process = async (filePath) => {
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

      // Column 1 = Day
      if (row[0]) {
        currentDay = row[0];
      }

      const room = row[1];

      if (!room || !currentDay) continue;

      for (let col = 2; col < row.length; col++) {
        const cellValue = row[col];

        if (!cellValue || typeof cellValue !== "string") continue;

        // each slot block
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

    console.log("✅ Final structured JSON generated");
    console.log(`Total Records: ${finalData.length}`);

    // Optional debug output
    // console.log(JSON.stringify(finalData, null, 2));

    // =========================================
    // 3. Insert Into Database
    // =========================================
    const insertResult = await insert_service.insert_all(finalData);

    console.log("✅ Data inserted into DB successfully");

    // =========================================
    // 4. Final API Response
    // =========================================
    return {
      message: "Timetable uploaded successfully",
      total_records: finalData.length,
      insert_summary: insertResult
    };

  } catch (err) {
    console.error("❌ Pipeline failed:", err.message);
    throw new Error(err.message);
  }
};