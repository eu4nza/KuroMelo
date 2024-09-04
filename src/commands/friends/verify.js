const { ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const getRole = require('../../functions/getRole');

module.exports = {
    name: 'verify',
    description: 'Verify a user',
    staff: true,
    friends: true,
    options: [
        {
            name: 'user',
            description: 'The user to verify.',
            type: 6,
            required: true,
        }
    ],
    async execute(interaction, db) {
        try {
            const getRoleID = getRole(db, 'roles');

            const verifiedRoleID = await getRoleID(interaction.guild.id, 'verifiedRole');
            const user = interaction.options.get('user').member;
            const member = interaction.member;
            const denied = '<:denied:1211653626611896420>';

            if (user.user.bot) {
                return interaction.reply({ content: `${denied} You cannot verify a bot.`, ephemeral: true });
            }

            if (user.id === member.id) {
                return interaction.reply({ content: `${denied} You cannot verify yourself.`, ephemeral: true });
            }

            if (user.roles.cache.has(verifiedRoleID)) {
                return interaction.reply({ content: `${denied} ${user} is already verified.`, ephemeral: true });
            }

            const confirmButton = new ButtonBuilder()
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Success)
            .setCustomId('confirm-verify');

            const component = new ActionRowBuilder().addComponents(confirmButton);

            return interaction.reply({ content: `Are you sure you want to verify ${user}? If not, ignore and dismiss this message.`, components: [component], ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '<:error:1211653628142551040> Verified role not set.', ephemeral: true });
        }
    }
};