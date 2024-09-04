const { EmbedBuilder } = require('discord.js');
const getChannel = require('../../functions/getChannel');

module.exports = {
    name: 'confirm-kick',
    moderator: true,
    async execute(interaction, db, client) {
        try {
            const userRegex = /<@!?(.*?)>/;
            const reasonRegex = /"(.*?)"/;
            const content = interaction.message.content;
            const userMatch = content.match(userRegex);
            const reasonMatch = content.match(reasonRegex);
            const error = '<:error:1211653628142551040>';
    
            if (!userMatch || userMatch.length < 1) {
                return interaction.reply({ content: `${error} User mention not found.`, ephemeral: true });
            }
    
            const userId = userMatch[1];
            const user = interaction.guild.members.cache.get(userId);

            if (!user) {
                return interaction.reply({ content: `${error} User not found.`, ephemeral: true });
            }
    
            let reason = null;
    
            if (reasonMatch && reasonMatch.length > 0) {
                reason = reasonMatch[1];
            }
    
            const guild = interaction.guild;
    
            const getChannelID = getChannel(db, 'channels');
            const logCommandChannelID = await getChannelID(guild.id, 'logCommandChannel');
    
            const member = interaction.member;
    
            if (logCommandChannelID) {
                const guildID = '1192921271462281216';
                const guild = client.guilds.cache.get(guildID);
                const logCommandChannel = guild.channels.cache.get(logCommandChannelID);
    
                if (logCommandChannel) {
                    let reasonDescription = reason ? `\n* **Reason:** ${reason}` : "\n* **Reason:** No reason provided";
                    const embed = new EmbedBuilder()
                    .setColor('#e74c3c')
                    .setTitle('A user has been kicked')
                    .setDescription(`* **User:** ${user}\n* **Responsible Staff:** ${member.user}.${reasonDescription}`)
                    .setFooter({ text: `ID: ${userId}` })
                    .setTimestamp();
    
                    logCommandChannel.send({ embeds: [embed] });
                }
            }
            await interaction.guild.members.kick(userId);
            await interaction.reply({ content: `<:granted:1211653624875454484> Successfully kicked ${user}${reason ? ` with reason: ${reason}` : ''}.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '<:error:1211653628142551040> An error occurred, please try again.', ephemeral: true });
        }
    }
};
