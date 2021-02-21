// Node.js socket client script
const net = require('net');

const generateRandomFloat = (min, max) => {
  const i = Math.random() * (max - min) + min

  // Truncate to 2 dp
  return i.toFixed(2)
}

const generateRandomNumber = (min, max) => {
  const i = Math.random() * (max - min) + min

  return Math.floor(i)
}

const timer = ms => new Promise(res => setTimeout(res, ms))

const writeRawData = (client) => {
  const x_reading = generateRandomFloat(0, 100)
  const y_reading = generateRandomFloat(0, 100)
  const z_reading = generateRandomFloat(0, 100)
  const roll = generateRandomFloat(0, 100)
  const pitch = generateRandomFloat(0, 100)
  const yaw = generateRandomFloat(0, 100)
  const emg_reading = generateRandomNumber(0, 100)
  const currentTIme = new Date().toISOString()

  const message = `@${x_reading}, ${y_reading}, ${z_reading}|${roll}, ${pitch}, ${yaw}|${emg_reading}|1|${currentTIme}`
  console.log(message)

  client.write(message)
}

const client = net.createConnection({ port: 3000 }, async () => {
  console.log('Connected to server.');

  // Send 20 raw data points at 1 second apart
  for (let i = 0; i < 10; i++) {
    // client.write(`#3|dab|3|1|${currentTime}`);
    // client.write(`@8.21, 10.24, 6.05|10.25, 33.8, 5.85|6|1|${currentTime}`);
    writeRawData(client)
    await timer(1000)
  }
  client.end()
});
client.on('error', () => {
  console.log('Error connecting to server.')
})
client.on('end', () => {
  console.log('Disconnected from server.');
})
