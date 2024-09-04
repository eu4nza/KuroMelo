const updateStatus = require('../functions/updateStatus');
const scanAllMembers = require('../functions/scanMembers');

async function handleReady(client, publicGuildID) {
  console.log(`Logged in as ${client.user.tag}`);
  updateStatus(client, publicGuildID);

  client.guilds.cache.forEach(guild => {
    scanAllMembers(guild);
  });
}

module.exports = handleReady;