const { EmbedBuilder } = require('discord.js');
const getChannel = require('../../functions/getChannel');

module.exports = {
    name: 'confirm-timeout',
    moderator: true,
    async execute(interaction, db, client) {
        try {
            const userRegex = /<@!?(.*?)>/;
            const reasonRegex = /"(.*?)"/;
            const timeoutRegex = /'(.*?)'/;
            const content = interaction.message.content;
            const userMatch = content.match(userRegex);
            const reasonMatch = content.match(reasonRegex);
            const timeoutMatch = content.match(timeoutRegex);
            const error = '<:error:1211653628142551040>';

            if (!userMatch || userMatch.length < 1) {
                return interaction.reply({ content: `${error} User mention not found.`, ephemeral: true });
            }

            const userId = userMatch[1];
            const user = interaction.guild.members.cache.get(userId);

            if (!user) {
                return interaction.reply({ content: `${error} User not found.`, ephemeral: true });
            }

            if (user.isCommunicationDisabled()){
                return interaction.reply({ content: `<:denied:1211653626611896420> ${user} is already on timeout.`, ephemeral: true});
            }

            let timeout = 0;

            if (timeoutMatch) {
                const timeInput = timeoutMatch[1];
                if (timeInput === '60 seconds') {
                    timeout = 60;
                } else if (timeInput === '5 minutes') {
                    timeout = 300;
                } else if (timeInput === '10 minutes') {
                    timeout = 600;
                } else if (timeInput === '1 hour') {
                    timeout = 3600;
                } else if (timeInput === '1 day') {
                    timeout = 86400;
                } else if (timeInput === '1 week') {
                    timeout = 604800;
                } else {
                    return interaction.reply({ content: `${error} Invalid timeout format.`, ephemeral: true });
                }
            }

            const timeInput = timeoutMatch[1];
            let reason = null;

            if (reasonMatch && reasonMatch.length > 0) {
                reason = reasonMatch[1];
            }

            await user.timeout(timeout * 1000);
            
            const guild = interaction.guild;

            const getChannelID = getChannel(db, 'channels');
            const logCommandChannelID = await getChannelID(guild.id, 'logCommandChannel');

            const member = interaction.member;

            if (logCommandChannelID) {
                const guildID = '1192921271462281216';
                const guild = client.guilds.cache.get(guildID);
                const logCommandChannel = guild.channels.cache.get(logCommandChannelID);

                if (logCommandChannel) {
                    const reasonDescription = reason ? `\n* **Reason:** ${reason}` : "\n* **Reason:** No reason provided";
                    const embed = new EmbedBuilder()
                    .setColor('#e74c3c')
                    .setTitle('A user has been timeout')
                    .setDescription(`* **User:** ${user}\n* **Duration:** ${timeInput}\n* **Responsible Staff:** ${member.user}${reasonDescription}`)
                    .setFooter({ text: `ID: ${userId}` })
                    .setTimestamp();

                    logCommandChannel.send({ embeds: [embed] });
                }
            }

            await interaction.reply({ content: `<:granted:1211653624875454484> Successfully timeout ${user} for ${timeInput}${reason ? ` with reason: ${reason}` : ''}.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '<:error:1211653628142551040> An error occurred, please try again.', ephemeral: true });
        }
    }
};
