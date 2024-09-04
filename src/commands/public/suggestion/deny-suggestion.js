const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const getChannel = require('../../../functions/getChannel');

module.exports = {
    name: 'deny-suggestion',
    description: 'Denies a suggestion',
    public: true,
    admin: true,
    options: [
        {
            name: 'id',
            description: 'Suggestion ID of the suggestion you want to deny',
            type: 3,
            required: true,
        },
        {
            name: 'reason',
            description: 'Reason of deny',
            type: 3,
            required: true,
        }
    ],
    async execute(interaction, db) {
        try {
            const suggestionID = interaction.options.getString('id');
            const error = '<:error:1247140297784426567>';
            db.get('SELECT * FROM suggestions WHERE suggestionId = ?', [suggestionID], async (err, suggestion) => {
                if (err) {
                    console.error(`Error retrieving suggestion: ${err.message}`);
                    return interaction.reply({ content: `${error} Error retrieving suggestion.`, ephemeral: true });
                }

                if (!suggestion) {
                    return interaction.reply({ content: `${error} Suggestion ID not found.`, ephemeral: true });
                }

                const guild = interaction.guild;

                const getChannelID = getChannel(db, 'channels');
                const suggestionsChannelID = await getChannelID(guild.id, 'suggestionsChannel');
                const suggestionsChannel = interaction.guild.channels.cache.get(suggestionsChannelID);

                const suggestionMessage = await suggestionsChannel.messages.fetch(suggestion.messageId).catch(console.error);
                
                if (!suggestionMessage) {
                    return interaction.reply({ content: `${error} Suggestion message not found.`, ephemeral: true });
                }

                const reason = interaction.options.getString('reason');
                const target = await guild.members.fetch(suggestion.userId);
                const suggestionEmbed = suggestionMessage.embeds[0];

                await suggestionsChannel.messages.fetch();

                let upvote = suggestionMessage.reactions.cache.get('⬆️').count;
                let downvote = suggestionMessage.reactions.cache.get('⬇️').count;

                upvote -= 1;
                downvote -= 1;

                const embed = new EmbedBuilder()
                .setColor('#e74c3c')
                .setTitle(`Denied ${target.user.username}'s Suggestion`)
                .addFields(
                    { name: 'Suggestion', value: `${suggestionEmbed.description}` },
                    { name: `Reason from ${interaction.user.username}`, value: `${reason}` },
                )
                .setThumbnail(`${target.displayAvatarURL()}`)
                .setFooter({ text: `Upvotes: ${upvote} - Downvotes: ${downvote} - Suggestion ID: ${suggestionID}` })
                .setTimestamp();

                const deniedSuggestionsChannelID = await getChannelID(guild.id, 'deniedSuggestionsChannel');
                const deniedSuggestionsChannel = interaction.guild.channels.cache.get(deniedSuggestionsChannelID);

                const sentDeniedSuggestion = await deniedSuggestionsChannel.send({ embeds: [embed]});

                const replyEmbed = new EmbedBuilder()
                .setTitle('<:granted:1247140301060046907> Successfully denied suggestion!')
                .setColor('#2ecc70');

                const urlButton = new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel('Click here to view!')
                .setURL(`${sentDeniedSuggestion.url}`);
                
                const component = new ActionRowBuilder().addComponents(urlButton);

                interaction.reply({ embeds: [replyEmbed], components: [component], ephemeral: true });

                target.send({ embeds: [embed], components: [component], ephemeral: true });

                await suggestionMessage.delete();

                db.run('DELETE FROM suggestions WHERE suggestionId = ?', [suggestionID], (err) => {
                    if (err) {
                        console.error(`Error deleting suggestion from database: ${err.message}`);
                    }
                });
            });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '<:error:1211653628142551040> Error denying suggestion.', ephemeral: true });
        }
    }   
};
