const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const getChannel = require('../../../functions/getChannel');

module.exports = {
    name: 'approve-suggestion',
    description: 'Approves a suggestion',
    public: true,
    admin: true,
    options: [
        {
            name: 'id',
            description: 'Suggestion ID of the suggestion you want to approve',
            type: 3,
            required: true,
        },
        {
            name: 'reason',
            description: 'Reason of approval',
            type: 3,
            required: true,
        }
    ],
    async execute(interaction, db) {
        try {
            const suggestionID = interaction.options.getString('id');

            db.get('SELECT * FROM suggestions WHERE suggestionId = ?', [suggestionID], async (err, suggestion) => {
                if (err) {
                    console.error(`Error retrieving suggestion: ${err.message}`);
                    return interaction.reply({ content: '<:error:1211653628142551040> Error retrieving suggestion.', ephemeral: true });
                }

                if (!suggestion) {
                    return interaction.reply({ content: '<:error:1211653628142551040> Suggestion ID not found.', ephemeral: true });
                }

                const guild = interaction.guild;

                const getChannelID = getChannel(db, 'channels');
                const suggestionsChannelID = await getChannelID(guild.id, 'suggestionsChannel');
                const suggestionsChannel = interaction.guild.channels.cache.get(suggestionsChannelID);

                const suggestionMessage = await suggestionsChannel.messages.fetch(suggestion.messageId).catch(console.error);
                
                if (!suggestionMessage) {
                    return interaction.reply({ content: '<:error:1211653628142551040> Suggestion message not found.', ephemeral: true });
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
                .setColor('#2ecc70')
                .setTitle(`Approved ${target.user.username}'s Suggestion`)
                .addFields(
                    { name: 'Suggestion', value: `${suggestionEmbed.description}` },
                    { name: `Reason from ${interaction.user.username}`, value: `${reason}` },
                )
                .setThumbnail(`${target.displayAvatarURL()}`)
                .setFooter({ text: `Upvotes: ${upvote} - Downvotes: ${downvote} - Suggestion ID: ${suggestionID}` })
                .setTimestamp();

                const approvedSuggestionsChannelID = await getChannelID(guild.id, 'approvedSuggestionsChannel');
                const approvedSuggestionsChannel = interaction.guild.channels.cache.get(approvedSuggestionsChannelID);

                const sentApprovedSuggestion = await approvedSuggestionsChannel.send({ embeds: [embed]});

                const replyEmbed = new EmbedBuilder()
                .setTitle('<:granted:1211653624875454484> Successfully approved suggestion!')
                .setColor('#2ecc70');

                const urlButton = new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel('Click here to view!')
                .setURL(`${sentApprovedSuggestion.url}`);
                
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
            return interaction.reply({ content: '<:error:1211653628142551040> Error approving suggestion.', ephemeral: true });
        }
    }   
};
