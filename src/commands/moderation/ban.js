const { ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Ban a user',
    moderator: true,
    global: true,
    options: [
        {
            name: 'user',
            description: 'The user to ban.',
            type: 6,
            required: true,
        },
        {
            name: 'reason',
            description: 'Reason for ban',
            type: 3,
            required: false,
        }
    ],
    async execute(interaction) {
        try {
            const user = interaction.options.get('user').member;
            const member = interaction.member;
            const denied = '<:denied:1211653626611896420>';
            
            if (user.user.bot) {
                return interaction.reply({ content: `${denied} You cannot ban a bot.`, ephemeral: true });
            }
    
            if (user.id === member.id) {
                return interaction.reply({ content: `${denied} You cannot ban yourself.`, ephemeral: true });
            }
            
            const confirmButton = new ButtonBuilder()
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Success)
            .setCustomId('confirm-ban');
    
            const component = new ActionRowBuilder().addComponents(confirmButton);
    
            const reason = interaction.options.getString('reason');
            const reasonText = reason ? `with reason "${reason}"` : 'without any reason';
    
            return interaction.reply({ content: `Are you sure you want to ban ${user} ${reasonText}? If not, ignore and dismiss this message.`, components: [component], ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '<:error:1211653628142551040> An error occurred, please try again.', ephemeral: true });
        }
    }
}
