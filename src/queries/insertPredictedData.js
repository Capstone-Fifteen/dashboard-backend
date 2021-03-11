const pool = require('../config/postgres');

const insertPredictedData = async (data) => {
  // Packet format: #<position>|<action>|<sync>|<device id>|<timestamp>
  const tokenizedData = data.substr(1).split('|');
  const timestamp = new Date(parseFloat(tokenizedData[4])).toISOString();
  const deviceId = tokenizedData[3];
  const position = tokenizedData[0];
  const danceMove = tokenizedData[1];
  const delay = tokenizedData[2];

  const query = `INSERT INTO predicted_data(
                           created_at,
                           device_id,
                           dance_position,
                           dance_move,
                           delay
                           ) VALUES ($1, $2, $3, $4, $5);
                           `;
  const parameter = [timestamp, deviceId, position, danceMove, delay];

  await pool.query(query, parameter, (error) => {
    if (error) {
      console.log(
        `ERROR: Unable to write data for Device ID ${tokenizedData[3]} @ ${tokenizedData[4]}`,
        error
      );
    }
  });
};

module.exports = insertPredictedData;
