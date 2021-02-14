// Node.js socket client script
const net = require('net');
const client = net.createConnection({ port: 3000 }, () => {
  console.log('Connected to server.');
  const currentTime = new Date().toISOString()
  // client.write(`#3|dab|3|1|${currentTime}`);
  client.write(`@1.24, 2.13, 1.44|54.3, 21.0, 44.8|56|1|${currentTime}`);
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('Disconnected from server.');
})
