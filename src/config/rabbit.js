const host = process.env.RABBITMQ_HOST || 'localhost';
const user = process.env.RABBITMQ_USER || 'guest';
const password = process.env.RABBITMQ_PASSWORD || 'guest';

module.exports = `${user}:${password}@${host}`;
