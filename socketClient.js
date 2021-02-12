// Node.js socket client script
const net = require('net');
const client = net.createConnection({ port: 3000 }, () => {
  console.log('CLIENT: I connected to the server.');
  const currentTime = new Date().toISOString()
  client.write(`#3|dab|3|1|${currentTime}`);
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('CLIENT: I disconnected from the server.');
})
