const { EmbedBuilder } = require('discord.js');
const updateStatus = require('../functions/updateStatus');
const getChannel = require('../functions/getChannel');

module.exports = {
  name: 'guildMemberAdd',
  async execute (member, db, client, publicGuildID) {
    
    if (member.user.bot) return;

    try {
      const getJoinLogChannelID = getChannel(db, 'channels');
      const joinLogChannelID = await getJoinLogChannelID(member.guild.id, 'joinLogChannel');
  
      if (joinLogChannelID) {
        const guildID = '1192921271462281216';
        const guild = client.guilds.cache.get(guildID);
        const joinLogChannel = guild.channels.cache.get(joinLogChannelID);
        
        if (joinLogChannel) {
          db.get('SELECT * FROM oldmembers WHERE guildId = ? AND userId = ?', [member.guild.id, member.id], (err, row) => {
            if (err) {
              console.error(`Error checking old members table: ${err.message}`);
              return;
            }
            const isOldMember = !!row;
  
            const embed = new EmbedBuilder()
              .setColor(isOldMember ? '#f39c12' : '#2ecc70')
              .setTitle(isOldMember ? 'An old member rejoined the server' : 'A new member joined the server')
              .setDescription(`${member.user} ${isOldMember ? 'rejoined' : 'joined'} the server`)
              .setFooter({ text: `ID: ${member.id}` })
              .setTimestamp();
  
            joinLogChannel.send({ embeds: [embed] });
            const joinTimestamp = Math.floor(new Date() / 1000);
            db.run('INSERT OR REPLACE INTO jointimestamp (guildId, userId, joinTimestamp) VALUES (?, ?, ?)', [member.guild.id, member.id, joinTimestamp], (err) => {
              if (err) {
                console.error(`Error inserting or replacing join timestamp for ${member.user.tag}: ${err.message}`);
              }
            });
          });

          if (member.guild.id == publicGuildID) {
            updateStatus(client, publicGuildID);
          }
        } else {
          console.log(`join-log channel ID: ${joinLogChannelID} does not exist on ${member.guild.name}`);
        }
      }
    } catch (error) {
      console.log(`join-log is not set on ${member.guild.name}`);
    }
  }
};
