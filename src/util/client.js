const amqp = require('amqplib/callback_api');
const host = require('../config/rabbit');

/**
 * Test Script for RabbitMQ
 */

const generateRandomFloat = (min, max) => {
  const i = Math.random() * (max - min) + min;

  // Truncate to 2 dp
  return i.toFixed(2);
};

const generateRandomNumber = (min, max) => {
  const i = Math.random() * (max - min) + min;

  return Math.floor(i);
};

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

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

const main = async () => {
  for (let i = 0; i < 1000; i++) {
    amqp.connect(`amqp://${host}`, (error0, connection) => {
      if (error0) {
        throw error0;
      }
      connection.createChannel(async (error1, channel) => {
        if (error1) {
          throw error1;
        }

        const queue = 'data_queue';

        const message1 = writeRawData(1);
        const message2 = writeRawData(2);
        const message3 = writeRawData(3);

        channel.sendToQueue(queue, Buffer.from(message1));
        console.log(' [x] Sent %s', message1);

        channel.sendToQueue(queue, Buffer.from(message2));
        console.log(' [x] Sent %s', message2);

        channel.sendToQueue(queue, Buffer.from(message3));
        console.log(' [x] Sent %s', message3);

        if (i % 100 === 0) {
          const messageA = writePredictedData(1);
          const messageB = writePredictedData(2);
          const messageC = writePredictedData(3);

          channel.sendToQueue(queue, Buffer.from(messageA));
          console.log(' [x] Sent %s', messageA);

          channel.sendToQueue(queue, Buffer.from(messageB));
          console.log(' [x] Sent %s', messageB);

          channel.sendToQueue(queue, Buffer.from(messageC));
          console.log(' [x] Sent %s', messageC);
        }
      });
      setTimeout(() => {
        connection.close();
      }, 500);
    });
    await sleep(50);
  }
};

main();
