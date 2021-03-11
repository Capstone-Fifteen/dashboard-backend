const amqp = require('amqplib/callback_api');

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

const writeRawData = (deviceId) => {
  // Packet format: @<accelerometer data>|<gyroscope data>|<EMG readings>|<device id>|<timestamp>
  const x_reading = generateRandomFloat(0, 100);
  const y_reading = generateRandomFloat(0, 100);
  const z_reading = generateRandomFloat(0, 100);
  const roll = generateRandomFloat(0, 100);
  const pitch = generateRandomFloat(0, 100);
  const yaw = generateRandomFloat(0, 100);
  const emg_reading = generateRandomNumber(0, 100);
  const currentTime = new Date().getTime();

  return `@${x_reading}, ${y_reading}, ${z_reading}|${roll}, ${pitch}, ${yaw}|${emg_reading}|${deviceId}|${currentTime}`;
};

const writePredictedData = (deviceId) => {
  // Packet format: #<position>|<action>|<sync>|<device id>|<timestamp>
  const position = generateRandomNumber(1, 3);
  const action = danceMoves[generateRandomNumber(0, danceMoves.length)];
  const sync = generateRandomFloat(-5, 5);
  const currentTime = new Date().getTime();

  return `#${position}|${action}|${sync}|${deviceId}|${currentTime}`;
};

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0;
  }
  connection.createChannel(async (error1, channel) => {
    if (error1) {
      throw error1;
    }

    const rawQueue = 'raw_data';
    const predictedQueue = 'predicted_data';

    channel.assertQueue(rawQueue, {
      durable: false,
    });

    channel.assertQueue(predictedQueue, {
      durable: false,
    });

    for (let i = 0; i < 50; i++) {
      if (i % 3 === 0) {
        const message1 = writeRawData(1);
        const message2 = writeRawData(2);
        const message3 = writeRawData(3);

        channel.sendToQueue(rawQueue, Buffer.from(message1));
        console.log(' [x] Sent %s', message1);

        channel.sendToQueue(rawQueue, Buffer.from(message2));
        console.log(' [x] Sent %s', message2);

        channel.sendToQueue(rawQueue, Buffer.from(message3));
        console.log(' [x] Sent %s', message3);
      }

      if (i % 5 === 0) {
        const message1 = writePredictedData(1);
        const message2 = writePredictedData(2);
        const message3 = writePredictedData(3);

        channel.sendToQueue(predictedQueue, Buffer.from(message1));
        console.log(' [x] Sent %s', message1);

        channel.sendToQueue(predictedQueue, Buffer.from(message2));
        console.log(' [x] Sent %s', message2);

        channel.sendToQueue(predictedQueue, Buffer.from(message3));
        console.log(' [x] Sent %s', message3);
      }
    }
  });
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
});
