// =============================================
// FILE: src/services/room_booking_service.js
// =============================================

const sequelize = require("../../config/db_config");

// =============================================
// SEARCH AVAILABLE ROOMS
// =============================================

exports.search_available_rooms = async ({
  room_type,
  booking_date,
  start_time,
  end_time
}) => {
  try {
    console.log('Service received params:', {
      room_type,
      booking_date,
      start_time,
      end_time
    });

    const [rooms] = await sequelize.query(`
      SELECT *
      FROM Rooms r
      WHERE
        (:room_type IS NULL OR r.room_type = :room_type)

        AND r.room_id NOT IN (
          SELECT rb.room_id
          FROM RoomBookings rb
          WHERE
            rb.booking_date = :booking_date
            AND rb.status = 'Approved'
            AND (
              :start_time < rb.end_time
              AND :end_time > rb.start_time
            )
        )
    `, {
      replacements: {
        room_type: room_type || null,
        booking_date,
        start_time,
        end_time
      }
    });

    return {
      success: true,
      data: rooms
    };

  } catch (err) {
    console.error('Service error:', err);
    throw new Error(err.message);
  }
};

// =============================================
// 🔥 HELPER: GET TEACHER ID (TA OR TEACHER)
// =============================================

const resolveTeacherId = async (user_id, role) => {
  if (role === "TA") {
    const [ta] = await sequelize.query(`
      SELECT teacher_id
      FROM TAs
      WHERE ta_id = :ta_id
    `, {
      replacements: { ta_id: user_id }
    });

    if (!ta.length || !ta[0].teacher_id) {
      throw new Error("TA is not linked with any teacher");
    }

    return ta[0].teacher_id;
  }

  return user_id; // teacher case
};

// =============================================
// CREATE BOOKING REQUEST
// =============================================

exports.book_room = async ({
  user_id,
  role,
  room_id,
  booking_date,
  start_time,
  end_time,
  purpose
}) => {
  try {
    const teacher_id = await resolveTeacherId(user_id, role);

    await sequelize.query(`
      INSERT INTO RoomBookings (
        teacher_id,
        room_id,
        room_type,
        booking_date,
        start_time,
        end_time,
        purpose,
        status
      )
      SELECT
        :teacher_id,
        r.room_id,
        ISNULL(r.room_type, 'Class Room'),  -- ✅ FIX NULL ISSUE
        :booking_date,
        :start_time,
        :end_time,
        :purpose,
        'Pending'
      FROM Rooms r
      WHERE r.room_id = :room_id
    `, {
      replacements: {
        teacher_id,
        room_id,
        booking_date,
        start_time,
        end_time,
        purpose
      }
    });

    return {
      success: true,
      message: "Booking request sent to admin"
    };

  } catch (err) {
    throw new Error(err.message);
  }
};

// =============================================
// GET BOOKINGS (TA + TEACHER)
// =============================================

exports.get_my_bookings = async (user_id, role) => {
  try {
    const teacher_id = await resolveTeacherId(user_id, role);

    const [data] = await sequelize.query(`
      SELECT
        rb.booking_id,
        r.room_number,
        r.room_type,
        rb.booking_date,
        rb.start_time,
        rb.end_time,
        rb.purpose,
        rb.status,
        rb.requested_at
      FROM RoomBookings rb
      JOIN Rooms r
        ON rb.room_id = r.room_id
      WHERE rb.teacher_id = :teacher_id
      ORDER BY rb.requested_at DESC
    `, {
      replacements: { teacher_id }
    });

    return data;

  } catch (err) {
    throw new Error(err.message);
  }
};

// =============================================
// ADMIN: GET ALL BOOKING REQUESTS
// =============================================

exports.get_all_booking_requests = async () => {
  try {
    const [data] = await sequelize.query(`
      SELECT
        rb.booking_id,
        t.name AS teacher_name,
        r.room_number,
        r.room_type,
        rb.booking_date,
        rb.start_time,
        rb.end_time,
        rb.purpose,
        rb.status,
        rb.requested_at
      FROM RoomBookings rb
      JOIN Teachers t
        ON rb.teacher_id = t.teacher_id
      JOIN Rooms r
        ON rb.room_id = r.room_id
      ORDER BY rb.requested_at DESC
    `);

    return data;

  } catch (err) {
    throw new Error(err.message);
  }
};

// =============================================
// ADMIN: APPROVE BOOKING
// =============================================

exports.approve_booking = async (booking_id, admin_user_id) => {
  try {
    await sequelize.query(`
      UPDATE RoomBookings
      SET
        status = 'Approved',
        approved_by = :admin_user_id
      WHERE booking_id = :booking_id
    `, {
      replacements: {
        booking_id,
        admin_user_id
      }
    });

    return {
      success: true,
      message: "Booking approved"
    };

  } catch (err) {
    throw new Error(err.message);
  }
};

// =============================================
// ADMIN: REJECT BOOKING
// =============================================

exports.reject_booking = async (booking_id, admin_user_id) => {
  try {
    await sequelize.query(`
      UPDATE RoomBookings
      SET
        status = 'Rejected',
        approved_by = :admin_user_id
      WHERE booking_id = :booking_id
    `, {
      replacements: {
        booking_id,
        admin_user_id
      }
    });

    return {
      success: true,
      message: "Booking rejected"
    };

  } catch (err) {
    throw new Error(err.message);
  }
};