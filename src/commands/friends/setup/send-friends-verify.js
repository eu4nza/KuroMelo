const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'send-friends-verify',
    description: 'Send verify embed on a channel',
    admin: true,
    friends: true,
    async execute(interaction) {
        try {
              const embed = new EmbedBuilder()
              .setTitle('<:error:1211653628142551040> Verification Required')
              .setDescription('In order to access this server, a member should notify us about you joining this server or you must be a verified member of our other known servers.')
              .setFooter({ text: 'Please contact that member to get verified to our server or contact a staff if you are a verified member of our other known servers.'})
              .setColor('#e74c3c');
    
              interaction.channel.send({ embeds: [embed] });
    
              return interaction.reply({ content: '<:granted:1211653624875454484>', ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '<:error:1211653628142551040> An error occurred, please try again.', ephemeral: true });
        }
    }
};