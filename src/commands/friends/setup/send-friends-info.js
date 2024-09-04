const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'send-friends-info',
    description: 'Send embed info on a channel',
    admin: true,
    friends: true,
    async execute(interaction) {
        try {
            const embed = new EmbedBuilder()
            .setTitle('Welcome to mahinamoon✧☽!')
            .setDescription('Tinitigan ko')
            .setColor('#9c82c5');
    
            const aboutButton = new ButtonBuilder()
            .setLabel('About')
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('about')
            .setEmoji('1213423015308820500');
    
            const infoButton = new ButtonBuilder()
            .setLabel('Info')
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('friends-info')
            .setEmoji('1213424050693472268');
    
            const rulesButton = new ButtonBuilder()
            .setLabel('Rules')
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('rules')
            .setEmoji('1211650146279104522');
    
            const marikitButton = new ButtonBuilder()
            .setLabel('Nilapitan ko')
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('nilapitan-ko')
            .setEmoji('1211653628142551040');
    
            const component = new ActionRowBuilder().addComponents(rulesButton, infoButton, aboutButton, marikitButton);
    
            interaction.channel.send({ embeds: [embed], components: [component] });
    
            return interaction.reply({ content: '<:granted:1211653624875454484>', ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '<:error:1211653628142551040> An error occurred, please try again.', ephemeral: true });
        }
    }
};
