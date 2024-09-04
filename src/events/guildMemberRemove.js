const { EmbedBuilder } = require('discord.js');
const getChannel = require('../functions/getChannel');
const updateStatus = require('../functions/updateStatus');

module.exports = {
  name: 'guildMemberRemove',
  async execute (member, db, client, publicGuildID) {
    
    if (member.user.bot) return;

    try {

      updateStatus(client, publicGuildID);
  
      const getLeaveLogChannelID = getChannel(db, 'channels');
      const leaveLogChannelID = await getLeaveLogChannelID(member.guild.id, 'leaveLogChannel');
  
      if (leaveLogChannelID) {
        const guildID = '1192921271462281216';
        const guild = client.guilds.cache.get(guildID);
        const leaveLogChannel = guild.channels.cache.get(leaveLogChannelID);

        if (leaveLogChannel) {
          db.get('SELECT joinTimestamp FROM jointimestamp WHERE guildId = ? AND userId = ?', [member.guild.id, member.id], (err, row) => {
            if (err) {
              console.error(`Error retrieving join timestamp for ${member.user.tag}: ${err.message}`);
            }
  
            const joinTimestamp = row ? row.joinTimestamp : null;
  
            const leaveLogEmbed = new EmbedBuilder()
              .setColor('#e74c3c')
              .setTitle('A member left the server')
              .setDescription(`${member.user} left the server\n**Joined on:** <t:${joinTimestamp}:f>`)
              .setFooter({ text: `ID: ${member.id}` })
              .setTimestamp();
  
            leaveLogChannel.send({ embeds: [leaveLogEmbed] });
  
            db.run('UPDATE jointimestamp SET joinTimestamp = NULL WHERE guildId = ? AND userId = ?', [member.guild.id, member.id], (updateErr) => {
              if (updateErr) {
                console.error(`Error updating join timestamp for ${member.user.tag}: ${updateErr.message}`);
              }
            });
          });
        }
      }
    } catch (error) {
      console.log(`leave-log is not set on ${member.guild.name}`);
    }
  }
};
