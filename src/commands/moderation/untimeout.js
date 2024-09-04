const { ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

module.exports = {
    name: 'untimeout',
    description: 'Untimeout a user',
    moderator: true,
    global: true,
    options: [
        {
            name: 'user',
            description: 'The user to untimeout.',
            type: 6,
            required: true,
        },
        {
            name: 'reason',
            description: 'Reason for untimeout',
            type: 3,
            required: false,
        }
    ],
    async execute(interaction) {
        try {
            const user = interaction.options.get('user').member;
    
            if (!user.isCommunicationDisabled()){
                return interaction.reply({ content: `<:denied:1211653626611896420> ${user} is not on timeout.`, ephemeral: true});
            }
    
            const confirmButton = new ButtonBuilder()
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Success)
            .setCustomId('confirm-untimeout');
    
            const component = new ActionRowBuilder().addComponents(confirmButton);
    
            const reason = interaction.options.getString('reason');
            const reasonText = reason ? `with reason "${reason}"` : 'without any reason';
    
            return interaction.reply({ content: `Are you sure you want to untimeout ${user} ${reasonText}? If not, ignore and dismiss this message.`, components: [component], ephemeral: true }).catch(console.error);
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '<:error:1211653628 142551040> An error occurred, please try again.', ephemeral: true });
        }
    }
}
