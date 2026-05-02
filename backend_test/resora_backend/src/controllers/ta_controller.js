// =============================================
// FILE: src/controllers/ta_controller.js
// =============================================

const roomBookingService = require("../services/room_booking_service");

// SEARCH AVAILABLE ROOMS
exports.search_available_rooms = async (req, res) => {
  try {
    const result = await roomBookingService.search_available_rooms({
      room_type: req.query.room_type,
      booking_date: req.query.booking_date,
      start_time: req.query.start_time,
      end_time: req.query.end_time
    });

    res.json(result);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

// BOOK ROOM
// BOOK ROOM
exports.book_room = async (req, res) => {
  try {
    const result = await roomBookingService.book_room({
      user_id: req.user.reference_id,   // ✅ FIX
      role: req.user.role,              // ✅ FIX (IMPORTANT)
      room_id: req.body.room_id,
      booking_date: req.body.booking_date,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      purpose: req.body.purpose
    });

    res.json(result);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

// MY BOOKINGS
// MY BOOKINGS
exports.get_my_bookings = async (req, res) => {
  try {
    const result = await roomBookingService.get_my_bookings(
      req.user.reference_id,   // ✅ FIX
      req.user.role            // ✅ FIX
    );

    res.json(result);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};