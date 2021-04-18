const CryptoJS = require('crypto-js');

const secret = process.env.AES_SECRET;

const decryptString = (message) => {
  const bytes = CryptoJS.AES.decrypt(message, secret);

  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = decryptString;
