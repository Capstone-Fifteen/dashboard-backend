const net = require('net');
const amqp = require('amqplib/callback_api');
const insertPredictedData = require('./src/queries/insertPredictedData');
const insertRawData = require('./src/queries/insertRawData');

const host = process.env.RABBITMQ_HOST || 'localhost';
const port = process.env.PORT || '3000';

/**
 * Backwards compatibility for FPGA interface via socket
 * Remove once fully migrated to RabbitMQ
 * @type {Server}
 */
const server = net
  .createServer((socket) => {
    socket.on('data', async (res) => {
      const data = res.toString();
      if (data[0] === '#') {
        await insertPredictedData(data, socket);
      } else if (data[0] === '@') {
        await insertRawData(data, socket);
      } else {
        socket.write('ERROR: Invalid packet format!');
      }
    });
  })
  .on('error', (err) => {
    console.error(err);
  });
server.listen(port, () => {
  console.log('Server listening on port ', server.address().port);
});

amqp.connect(`amqp://${host}`, (error0, connection) => {
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    const rawQueue = 'raw_data';
    const predictedQueue = 'predicted_data';

    channel.assertQueue(rawQueue, {
      durable: false,
    });
    console.log(' [*R] Waiting for messages in %s.', rawQueue);

    channel.assertQueue(predictedQueue, {
      durable: false,
    });
    console.log(' [*P] Waiting for messages in %s.', predictedQueue);

    channel.consume(
      rawQueue,
      async (msg) => {
        const data = msg.content.toString();
        console.log(' [xR] Received %s from %s', data, rawQueue);
        await insertRawData(data);
      },
      {
        noAck: true,
      }
    );

    channel.consume(
      predictedQueue,
      async (msg) => {
        const data = msg.content.toString();
        console.log(' [xP] Received %s from %s', data, predictedQueue);
        await insertPredictedData(data);
      },
      {
        noAck: true,
      }
    );
  });
});
