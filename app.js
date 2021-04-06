const amqp = require('amqplib/callback_api');
const host = require('./src/config/rabbit');
const queueName = require('./src/config/queueName');
const { SENSOR_DATA, PREDICTED_DATA } = require('./src/config/dataType');
const insertPredictedData = require('./src/queries/insertPredictedData');
const insertRawData = require('./src/queries/insertRawData');

// Type is either SENSOR_DATA or PREDICTED_DATA
const dataType = process.env.DATA_TYPE;

amqp.connect(`amqp://${host}`, (errorConn, connection) => {
  if (errorConn) {
    throw errorConn;
  }
  connection.createChannel((errorChn, channel) => {
    if (errorChn) {
      throw errorChn;
    }

    const queue = queueName[dataType];

    channel.assertQueue(queue, {
      durable: true,
    });
    console.log(' [*] Waiting for messages in %s.', queue);

    // each consumer can only process 10 message at a time
    channel.prefetch(10);

    channel.consume(
      queue,
      async (msg) => {
        const data = msg.content.toString();
        console.log(' [x] Received %s from %s', data, queue);

        // Only predicted data should be reliable; sensor data can be dropped
        if (dataType === SENSOR_DATA && data[0] === '@') {
          await insertRawData(data);
        } else if (dataType === PREDICTED_DATA && data[0] === '#') {
          await insertPredictedData(data);
          channel.ack(msg);
        } else {
          console.log(' [i] %s is an invalid message', data);
          if (dataType === PREDICTED_DATA) channel.reject(msg);
        }
      },
      {
        noAck: dataType === SENSOR_DATA, // use manual ack for predicted data queue
      }
    );
  });
});
