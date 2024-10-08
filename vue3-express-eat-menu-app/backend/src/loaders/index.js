const { loadSequelize } = require("../config/Psql");

module.exports = async () => {
  await loadSequelize();
};
