const amqp = require('amqplib/callback_api');
const host = require('./src/config/rabbit');
const insertPredictedData = require('./src/queries/insertPredictedData');
const insertRawData = require('./src/queries/insertRawData');

amqp.connect(`amqp://${host}`, (error0, connection) => {
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    const dataQueue = 'data_queue';

    channel.assertQueue(dataQueue, {
      durable: true,
    });
    console.log(' [*] Waiting for messages in %s.', dataQueue);

    // each consumer can only process 10 message at a time
    channel.prefetch(10);

    channel.consume(
      dataQueue,
      async (msg) => {
        const data = msg.content.toString();
        console.log(' [x] Received %s from %s', data, dataQueue);

        if (data[0] === '@') {
          await insertRawData(data);
        } else if (data[0] === '#') {
          await insertPredictedData(data);
        } else {
          console.log(' [i] %s is an invalid message', data);
        }
      },
      {
        noAck: true,
      }
    );
  });
});
