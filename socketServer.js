const net = require('net');
const { Pool } = require('pg');

const port = parseInt(process.env.PORT || 3000);
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
});

// Create a server object
const server = net.createServer((socket) => {
  socket.on('data', async (res) => {
    console.log(res)
    const data = res.toString()
    if (data[0] === '#') {
      await insertPredictedData(data)
    }
  });
  socket.write('SERVER: Hello! This is server speaking.');
  socket.end('SERVER: Closing connection now.');
}).on('error', (err) => {
  console.error(err);
});

server.listen(port, () => {
  console.log('Server listening on port ', server.address().port)
})

const insertPredictedData = async (data) => {
  // Packet format: #<position>|<action>|<sync>|<dancer id>|<timestamp>
  const tokenizedData = data.substr(1).split('|')

  const query = `INSERT INTO predicted_data(
                           prediction_timestamp,
                           device_id,
                           dance_position,
                           dance_move
                           ) VALUES ($1, $2, $3, $4);
                           `;
  const parameter = [tokenizedData[4], tokenizedData[3], tokenizedData[1], tokenizedData[0]]

  await pool.query(query, parameter, (error) => {
    if (error) {
      console.warn(`Error writing data for Device ID ${tokenizedData[3]} @ ${tokenizedData[4]}`)
    }
    pool.end()
  })
}