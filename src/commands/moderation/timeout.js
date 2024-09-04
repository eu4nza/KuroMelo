const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'timeout',
    description: 'Timeout a user',
    moderator: true,
    global: true,
    options: [
        {
            name: 'user',
            description: 'The user to timeout.',
            type: 6,
            required: true,
        },
        {
            name: 'duration',
            description: 'The user to timeout.',
            type: 4,
            required: true,
            choices: [
                { name: '60 seconds', value: 60 },
                { name: '5 minutes', value: 300 },
                { name: '10 minutes', value: 600 },
                { name: '1 hour', value: 3600 },
                { name: '1 day', value: 86400 },
                { name: '1 week', value: 604800 },
            ]
        },
        {
            name: 'reason',
            description: 'Reason for timeout',
            type: 3,
            required: false,
        }
    ],
    async execute(interaction) {
        try {
            const user = interaction.options.get('user').member;
            const durationSeconds = parseInt(interaction.options.getInteger('duration'));

            let duration = null;

            if (durationSeconds === 60) {
                duration = '60 seconds';
            } else if (durationSeconds === 300) {
                duration = '5 minutes';
            } else if (durationSeconds === 600) {
                duration = '10 minutes';
            } else if (durationSeconds === 3600) {
                duration = '1 hour';
            } else if (durationSeconds === 86400) {
                duration = '1 day';
            } else if (durationSeconds === 604800) {
                duration = '1 week';
            }

            const member = interaction.member;
            const denied = '<:denied:1211653626611896420>';
            
            if (user.user.bot) {
                return interaction.reply({ content: `${denied} You cannot timeout a bot.`, ephemeral: true });
            }
    
            if (user.id === member.id) {
                return interaction.reply({ content: `${denied} You cannot timeout yourself.`, ephemeral: true });
            }

            if (user.isCommunicationDisabled()){
                return interaction.reply({ content: `${denied} ${user} is already on timeout.`, ephemeral: true});
            }

            const confirmButton = new ButtonBuilder()
                .setLabel('Confirm')
                .setStyle(ButtonStyle.Success)
                .setCustomId('confirm-timeout');
    
            const component = new ActionRowBuilder().addComponents(confirmButton);
    
            const reason = interaction.options.getString('reason');
            const reasonText = reason ? `with reason "${reason}"` : 'without any reason';
    
            return interaction.reply({ content: `Are you sure you want to timeout ${user} for '${duration}' ${reasonText}? If not, ignore and dismiss this message.`, components: [component], ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '<:error:1211653628142551040> An error occurred, please try again.', ephemeral: true });
        }
    }
}
