const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'send-public-verify',
    description: 'Send verify embed on a channel',
    admin: true,
    public: true,
    async execute(interaction) {
        try {
              const embed = new EmbedBuilder()
              .setDescription('<:error:1247140297784426567> **Verification Required**\nClick the button below to get verified, a Captcha is also required to get verified.')
              .setColor('#e74c3c');
    
              const verifyButton = new ButtonBuilder()
              .setLabel('Verify')
              .setStyle(ButtonStyle.Secondary)
              .setCustomId('verify');
    
              const row = new ActionRowBuilder().addComponents(verifyButton);
    
              interaction.channel.send({ embeds: [embed], components: [row]});
    
              return interaction.reply({ content: '<:granted:1211653624875454484>', ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '<:error:1211653628142551040> An error occurred, please try again.', ephemeral: true });
        }
    }
};