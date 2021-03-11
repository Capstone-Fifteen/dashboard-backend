const pool = require('../config/postgres');

const insertRawData = async (data) => {
  // Packet format: @<accelerometer data>|<gyroscope data>|<EMG readings>|<device id>|<timestamp>
  const tokenizedData = data.substr(1).split('|');
  const timestamp = new Date(parseFloat(tokenizedData[4])).toISOString();
  const deviceId = tokenizedData[3];
  const accelerometerData = tokenizedData[0].split(',');
  const gyroscopeData = tokenizedData[1].split(',');
  const emgReading = tokenizedData[2];

  const query = `INSERT INTO raw_data(
                     created_at,
                     device_id,
                     x_reading,
                     y_reading,
                     z_reading,
                     pitch_reading,
                     roll_reading,
                     yaw_reading,
                     emg_reading
                     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                     `;
  const parameter = [
    timestamp,
    deviceId,
    accelerometerData[0],
    accelerometerData[1],
    accelerometerData[2],
    gyroscopeData[0],
    gyroscopeData[1],
    gyroscopeData[2],
    emgReading,
  ];

  await pool.query(query, parameter, (error) => {
    if (error) {
      console.log(
        `ERROR: Unable to write data for Device ID ${deviceId} @ ${timestamp}`,
        error
      );
    }
  });
};

module.exports = insertRawData;
