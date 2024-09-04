const { ActivityType } = require('discord.js');

module.exports = async function (client, publicGuildID) {
  const publicGuild = client.guilds.cache.get(publicGuildID);

  if (!publicGuild) return;

  try {
    await publicGuild.members.fetch();
    
    const memberCount = publicGuild.members.cache.filter(member => !member.user.bot).size;
    
    client.user.setPresence({
      activities: [{ name: `over ${memberCount} members`, type: ActivityType.Watching }]
    });
  } catch (error) {
    console.error('Error updating status:', error);
  }
}
