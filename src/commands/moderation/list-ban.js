const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'list-ban',
    description: 'List banned users',
    moderator: true,
    global: true,
    async execute(interaction) {
        try {
            const bannedList = await interaction.guild.bans.fetch();

            if (bannedList.size === 0) {
                return interaction.reply({ content: "There are no banned users in this server.", ephemeral: true });
            }
    
            const description = bannedList.map(banInfo => `**User:** ${banInfo.user.tag}\n**ID:** ${banInfo.user.id}\n**Reason:** ${banInfo.reason ? banInfo.reason : "No reason provided"}`).join('\n');
    
            const embed = new EmbedBuilder()
                .setTitle("Banned Users")
                .setColor("#ff0000")
                .setDescription(description);
    
            return interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '<:error:1211653628142551040> An error occurred, please try again.', ephemeral: true });
        }
    }
};
