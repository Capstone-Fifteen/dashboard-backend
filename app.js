const express = require('express')
const app = express()

const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
  console.log(`${Date()}: Client ${socket.id} Connected`);
  socket.on('disconnect', () => {
    console.log(`${Date()}: Client ${socket.id} Connected`)
  })
});


http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
