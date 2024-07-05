const proxies = require("../config/proxies");

function getRandomProxy() {
  const randomIndex = Math.floor(Math.random() * proxies.length);
  return proxies[randomIndex];
}

module.exports = { getRandomProxy };
