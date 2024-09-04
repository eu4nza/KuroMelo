const { EmbedBuilder } = require('discord.js');
const getChannel = require('../../functions/getChannel');
const getRole = require('../../functions/getRole');

module.exports = {
    name: 'confirm-verify',
    staff: true,
    async execute(interaction, db, client) {
        try {
            const mentionRegex = /<@!?(.*?)>/;
            const content = interaction.message.content;
            const match = content.match(mentionRegex);
            
            if (!match || match.length < 1) {
                return interaction.reply({ content: 'User mention not found.', ephemeral: true });
            }
    
            const userId = match[1];
            const user = interaction.guild.members.cache.get(userId);
            if (!user) {
                return interaction.reply({ content: 'User not found.', ephemeral: true });
            }
    
            const getRoleID = getRole(db, 'roles');
            const verifiedRoleID = await getRoleID(interaction.guild.id, 'verifiedRole');
            const verifiedRole = interaction.guild.roles.cache.get(verifiedRoleID);
    
            if (user.roles.cache.has(verifiedRoleID)) {
                return interaction.reply({ content: `<:denied:1211653626611896420> ${user} is already verified.`, ephemeral: true });
            }
    
            await user.roles.add(verifiedRole);
    
            const guild = interaction.guild;
    
            const getChannelID = getChannel(db, 'channels');
            const welcomeChannelID = await getChannelID(guild.id, 'welcomeChannel');
            const logCommandChannelID = await getChannelID(guild.id, 'logCommandChannel');
    
            const member = interaction.member;
    
            if (welcomeChannelID) {
                const welcomeChannel = guild.channels.cache.get(welcomeChannelID);
    
                if (welcomeChannel) {
                    db.get('SELECT * FROM oldmembers WHERE guildId = ? AND userId = ?', [user.guild.id, user.id], (err, row) => {
                        if (err) {
                            console.error(`Error checking old members table: ${err.message}`);
                            return;
                          }
                          const isOldMember = !!row;
                          
                      guild.members.fetch();
                      const memberCount = guild.members.cache.filter(member => !member.user.bot).size;
    
                      const embed = new EmbedBuilder()
                      .setAuthor({ name: isOldMember ? `Welcome back to ${guild.name}!` : `Welcome to ${guild.name}!`, iconURL: user.user.displayAvatarURL()})
                      .setDescription('* Please read the <#1139098399589810206> before chatting\n* Get roles in <#1205820826784505896>')
                      .setFooter({ text: `Member #${memberCount}` })
                      .setColor('#9c82c5');
    
                      welcomeChannel.send({ content: `${user}`, embeds: [embed] });
                      
                      db.run('INSERT OR REPLACE INTO oldmembers (guildId, userId) VALUES (?, ?)', [user.guild.id, user.id], (err) => {
                        if (err) {
                          console.error(`Error inserting or replacing oldmember for ${user.user.tag}: ${err.message}`);
                        }
                      });
                    });
                }
            }
    
            if (logCommandChannelID) {
                const guildID = '1192921271462281216';
                const guild = client.guilds.cache.get(guildID);
                const logCommandChannel = guild.channels.cache.get(logCommandChannelID);
    
                if (logCommandChannel) {
    
                    const embed = new EmbedBuilder()
                    .setColor('#2ecc70')
                    .setTitle('A user has been verified')
                    .setDescription(`${user.user} has been verified by ${member.user}`)
                    .setFooter({ text: `ID: ${member.id}` })
                    .setTimestamp();
    
                    logCommandChannel.send({ embeds: [embed] });
                }
            }
    
            return interaction.reply({ content: `<:granted:1211653624875454484> Successfully verified ${user}.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '<:error:1211653628142551040> An error occurred, please try again.', ephemeral: true });
        }
    }
};
