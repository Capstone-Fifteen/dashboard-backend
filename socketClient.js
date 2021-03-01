// Node.js socket client script
const net = require('net');

const generateRandomFloat = (min, max) => {
  const i = Math.random() * (max - min) + min;

  // Truncate to 2 dp
  return i.toFixed(2);
};

const generateRandomNumber = (min, max) => {
  const i = Math.random() * (max - min) + min;

  return Math.floor(i);
};

const danceMoves = [
  'Hair',
  'Dab',
  'Sidepunch',
  'Wipetable',
  'Sidekick',
  'Point High',
  'Gun',
  'Listen',
  'Finale',
];

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const writeRawData = (client) => {
  // Packet format: @<accelerometer data>|<gyroscope data>|<EMG readings>|<device id>|<timestamp>
  const x_reading = generateRandomFloat(0, 100);
  const y_reading = generateRandomFloat(0, 100);
  const z_reading = generateRandomFloat(0, 100);
  const roll = generateRandomFloat(0, 100);
  const pitch = generateRandomFloat(0, 100);
  const yaw = generateRandomFloat(0, 100);
  const emg_reading = generateRandomNumber(0, 100);
  const deviceId = generateRandomNumber(1, 3);
  const currentTime = new Date().getTime();

  const message = `@${x_reading}, ${y_reading}, ${z_reading}|${roll}, ${pitch}, ${yaw}|${emg_reading}|${deviceId}|${currentTime}`;
  console.log(message);

  client.write(message);
};

const writePredictedData = (client) => {
  // Packet format: #<position>|<action>|<sync>|<device id>|<timestamp>
  const position = generateRandomNumber(1, 3);
  const action = danceMoves[generateRandomNumber(0, danceMoves.length)];
  const sync = generateRandomFloat(-5, 5);
  const deviceId = generateRandomNumber(1, 3);
  const currentTime = new Date().getTime();

  const message = `#${position}|${action}|${sync}|${deviceId}|${currentTime}`;
  console.log(message);

  client.write(message);
};

const client = net.createConnection({ port: 3000 }, async () => {
  console.log('Connected to server.');

  // Send 20 raw data points at 1 second apart
  for (let i = 0; i < 50; i++) {
    writeRawData(client);
    writePredictedData(client);
    // eslint-disable-next-line no-await-in-loop
    await timer(1000);
  }
  client.end();
});
client.on('error', () => {
  console.log('Error connecting to server.');
});
client.on('end', () => {
  console.log('Disconnected from server.');
});
