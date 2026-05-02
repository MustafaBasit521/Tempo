const axios = require("axios");

const LLM_API_URL = process.env.LLM_API_URL;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// 🔥 SAFE MODEL (DO NOT CHANGE FOR NOW)
const LLM_MODEL = process.env.LLM_MODEL || "openai/gpt-oss-120b:free";

// 🔹 Chunking
function chunkArray(arr, size = 15) {
  const res = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

// 🔹 Sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 🔹 Clean output
function clean(output) {
  output = output.trim();
  if (output.startsWith("```")) {
    output = output.replace(/```json\n?|```\n?/g, "").trim();
  }
  return output;
}

// 🔹 Safe JSON parse
function safeParse(output) {
  try {
    return JSON.parse(output);
  } catch {
    const start = output.indexOf("{");
    const end = output.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      try {
        return JSON.parse(output.slice(start, end + 1));
      } catch {}
    }
    return null;
  }
}

// 🔹 LLM CALL
async function callLLM(chunk, index, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      console.log(`📤 Chunk ${index} (attempt ${attempt + 1})`);

      const res = await axios.post(
        LLM_API_URL,
        {
          model: LLM_MODEL,
          messages: [
            {
              role: "system",
              content: `
You are a strict timetable data extraction engine.

Return ONLY valid JSON:

{
  "departments": [],
  "teachers": [],
  "courses": [],
  "rooms": [],
  "schedules": []
}

Rules:
- Normalize departments:
  BSCS/BCS/CS → Computer Science
  BSE → Software Engineering
- Parse: "DLD (BCS-2A)" → course_code=DLD, section=BCS-2A
- Time: HH:MM:SS
- Day: Full name
- Room: "Lab 13" → "Lab-13"
- Skip invalid rows
- No duplicates
- No IDs
`
            },
            {
              role: "user",
              content: JSON.stringify(chunk)
            }
          ],
          temperature: 0.1,
          max_tokens: 1000
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Campus Resource System"
          },
          timeout: 60000
        }
      );

      let output = res.data.choices[0].message.content;
      output = clean(output);

      const parsed = safeParse(output);

      if (!parsed) throw new Error("Invalid JSON");

      console.log(`✅ Chunk ${index} success`);
      return parsed;

    } catch (err) {
      const errorMsg = err.response?.data || err.message;

      console.log(`❌ Chunk ${index} error:`, errorMsg);

      const isRateLimit = err.response?.status === 429;

      if (isRateLimit && attempt < retries - 1) {
        const wait = (attempt + 1) * 8000;
        console.log(`⏳ Rate limited → waiting ${wait / 1000}s`);
        await sleep(wait);
        continue;
      }

      // return empty so pipeline continues
      return {
        departments: [],
        teachers: [],
        courses: [],
        rooms: [],
        schedules: []
      };
    }
  }
}

// 🔹 MAIN FUNCTION
async function generate(raw_data) {
  try {
    console.time("LLM Total");

    // 🔥 initial delay (avoid instant rate limit)
    await sleep(3000);

    const chunks = chunkArray(raw_data, 15);
    console.log(`Total chunks: ${chunks.length}`);

    let final = {
      departments: [],
      teachers: [],
      courses: [],
      rooms: [],
      schedules: []
    };

    for (let i = 0; i < chunks.length; i++) {
      const res = await callLLM(chunks[i], i + 1);

      final.departments.push(...(res.departments || []));
      final.teachers.push(...(res.teachers || []));
      final.courses.push(...(res.courses || []));
      final.rooms.push(...(res.rooms || []));
      final.schedules.push(...(res.schedules || []));

      // 🔥 delay between requests (IMPORTANT)
      await sleep(4000);
    }

    console.timeEnd("LLM Total");
    console.log("✅ LLM processing complete");

    return final;

  } catch (err) {
    console.error("❌ Fatal error:", err.message);
    throw new Error("LLM failed: " + err.message);
  }
}

module.exports = { generate };