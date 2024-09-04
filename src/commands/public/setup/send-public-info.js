const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'send-public-info',
    description: 'Send embed info on a channel',
    admin: true,
    public: true,
    async execute(interaction) {
        try {
            const embed = new EmbedBuilder()
            .setTitle('Welcome to mahinamoon✧☽!')
            .setColor('#9c82c5');
    
            const aboutButton = new ButtonBuilder()
            .setLabel('About')
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('about')
            .setEmoji('1247134450496835605');
    
            const infoButton = new ButtonBuilder()
            .setLabel('Info')
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('public-info')
            .setEmoji('1247134460319633408');
    
            const rulesButton = new ButtonBuilder()
            .setLabel('Rules')
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('rules')
            .setEmoji('1247134463423418471');
    
            const component = new ActionRowBuilder().addComponents(rulesButton, infoButton, aboutButton);
    
            interaction.channel.send({ embeds: [embed], components: [component] });
    
            return interaction.reply({ content: '<:granted:1247140301060046907>', ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '<:error:1247140297784426567> An error occurred, please try again.', ephemeral: true });
        }
    }
};
