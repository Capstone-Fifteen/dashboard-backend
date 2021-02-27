const net = require('net');
const { Pool } = require('pg');

const port = parseInt(process.env.PORT || 3000);
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DATABASE || 'postgres',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
});

// Create a server object
const server = net
  .createServer((socket) => {
    socket.on('data', async (res) => {
      const data = res.toString();
      if (data[0] === '#') {
        await insertPredictedData(data, socket);
      } else if (data[0] === '@') {
        await insertRawData(data, socket);
      } else {
        socket.write('ERROR: Invalid packet format!')
      }
    });
    // socket.write('SERVER: Hello! This is server speaking.');
    // socket.end('SERVER: Closing connection now.');
  })
  .on('error', (err) => {
    console.error(err);
  });

server.listen(port, () => {
  console.log('Server listening on port ', server.address().port);
});

const insertPredictedData = async (data, socket) => {
  // Packet format: #<position>|<action>|<sync>|<device id>|<timestamp>
  const tokenizedData = data.substr(1).split('|');
  const timestamp = new Date(tokenizedData[4]).toISOString();
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
      socket.write(
        `ERROR: Unable to write data for Device ID ${tokenizedData[3]} @ ${tokenizedData[4]}`,
        error
      );
    } else {
      socket.write(
        `SUCCESS: Added predicted data for Device ID ${tokenizedData[3]} @ ${tokenizedData[4]}`
      );
    }
  });
};

const insertRawData = async (data, socket) => {
  // Packet format: @<accelerometer data>|<gyroscope data>|<EMG readings>|<device id>|<timestamp>
  const tokenizedData = data.substr(1).split('|');
  const timestamp = new Date(tokenizedData[4]).toISOString();
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
      socket.write(
        `ERROR: Unable to write data for Device ID ${deviceId} @ ${deviceTimestamp}`,
        error
      );
    } else {
      socket.write(
        `SUCCESS: Added raw data for Device ID ${tokenizedData[3]} @ ${tokenizedData[4]}`
      );
    }
  });
};
