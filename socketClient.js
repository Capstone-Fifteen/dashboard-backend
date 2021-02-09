// Node.js socket client script
const net = require('net');
const client = net.createConnection({ port: 3000 }, () => {
  console.log('CLIENT: I connected to the server.');
  client.write('#dab|40|2');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('CLIENT: I disconnected from the server.');
})
