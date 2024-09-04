const { ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

module.exports = {
    name: 'unban',
    description: 'Unban a user',
    moderator: true,
    global: true,
    options: [
        {
            name: 'id',
            description: 'The id of the user to unban.',
            type: 3,
            required: true,
        },
        {
            name: 'reason',
            description: 'Reason for unban',
            type: 3,
            required: false,
        }
    ],
    async execute(interaction) {
        try {
            const user = interaction.options.getString('id');

            const bannedList = await interaction.guild.bans.fetch();
            const bannedUser = bannedList.find(banInfo => banInfo.user.id === user);   
    
            if (!bannedUser) {
                return interaction.reply({ content: '<:error:1211653628142551040> This user is not banned.', ephemeral: true });
            }
    
            const confirmButton = new ButtonBuilder()
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Success)
            .setCustomId('confirm-unban');
    
            const component = new ActionRowBuilder().addComponents(confirmButton);
    
            const reason = interaction.options.getString('reason');
            const reasonText = reason ? `with reason "${reason}"` : 'without any reason';
    
            return interaction.reply({ content: `Are you sure you want to unban <@${user}> ${reasonText}? If not, ignore and dismiss this message.`, components: [component], ephemeral: true }).catch(console.error);
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '<:error:1211653628 142551040> An error occurred, please try again.', ephemeral: true });
        }
    }
}
