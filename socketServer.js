const net = require('net');

const port = process.env.PORT || 3000

// Create a server object
const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    console.log(data.toString());
  });
  socket.write('SERVER: Hello! This is server speaking.');
  socket.end('SERVER: Closing connection now.');
}).on('error', (err) => {
  console.error(err);
});

server.listen(port, () => {
  console.log('opened server on', server.address().port)
})
