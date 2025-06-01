const Log = require('../models/Log');

module.exports = async function logEvent(type, message) {
  await Log.create({ type, message });
};
