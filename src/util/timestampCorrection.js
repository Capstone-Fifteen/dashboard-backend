/**
 * Checks if received timestamp is erroneous
 * @param receivedTimestamp timestamp from FPGA
 * @returns {string} corrected timestamp
 */
const timestampCorrection = (receivedTimestamp) => {
  const serverTimestamp = new Date();

  if (serverTimestamp < receivedTimestamp) {
    return serverTimestamp.toISOString();
  }
  return receivedTimestamp.toISOString();
};

module.exports = timestampCorrection;
