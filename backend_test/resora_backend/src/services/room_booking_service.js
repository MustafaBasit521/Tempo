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

    return rooms;

  } catch (err) {
    throw new Error(err.message);
  }
};


// =============================================
// CREATE BOOKING REQUEST
// =============================================

exports.book_room = async ({
  teacher_id,
  room_id,
  booking_date,
  start_time,
  end_time,
  purpose
}) => {
  try {
    await sequelize.query(`
      INSERT INTO RoomBookings (
        teacher_id,
        room_id,
        booking_date,
        start_time,
        end_time,
        purpose,
        status
      )
      VALUES (
        :teacher_id,
        :room_id,
        :booking_date,
        :start_time,
        :end_time,
        :purpose,
        'Pending'
      )
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
// GET TEACHER BOOKINGS
// =============================================

exports.get_my_bookings = async (teacher_id) => {
  try {
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

exports.approve_booking = async (
  booking_id,
  admin_user_id
) => {
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

exports.reject_booking = async (
  booking_id,
  admin_user_id
) => {
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