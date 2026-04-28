const sequelize = require("../../config/db_config");

// CREATE ROOM
exports.create_room = async (data) => {
  const { room_number, building, floor, capacity, room_type } = data;

  await sequelize.query(`
    INSERT INTO Rooms (room_number, building, floor, capacity, room_type)
    VALUES (:room_number, :building, :floor, :capacity, :room_type)
  `, {
    replacements: { room_number, building, floor, capacity, room_type }
  });

  return { success: true };
};

// GET ALL ROOMS
exports.get_all_rooms = async () => {
  const [data] = await sequelize.query(`SELECT * FROM Rooms`);
  return data;
};

// DELETE ROOM
exports.delete_room = async (id) => {
  await sequelize.query(`
    DELETE FROM Rooms WHERE room_id = :id
  `, {
    replacements: { id }
  });

  return { success: true };
};