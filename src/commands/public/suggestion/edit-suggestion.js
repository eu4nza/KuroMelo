const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const getChannel = require('../../../functions/getChannel');

module.exports = {
    name: 'edit-suggestion',
    description: 'Edit your pending suggestion',
    public: true,
    options: [
        {
            name: 'id',
            description: 'Suggestion ID of your suggestion that you want to edit',
            type: 3,
            required: true,
        },
        {
            name: 'suggestion',
            description: 'Input your new suggestion',
            type: 3,
            required: true,
        }
    ],
    async execute(interaction, db) {
        try {
            const user = interaction.user;
            const suggestionID = interaction.options.getString('id');
            const newSuggestion = interaction.options.getString('suggestion');
            const error = '<:error:1247140297784426567>';

            db.get('SELECT * FROM suggestions WHERE suggestionId = ? AND userId = ?', [suggestionID, user.id], async (err, suggestion) => {
                if (err) {
                    console.error(`Error retrieving suggestion: ${err.message}`);
                    return interaction.reply({ content: `${error} Error retrieving suggestion ID.`, ephemeral: true });
                }

                if (!suggestion) {
                    return interaction.reply({ content: `${error}  Suggestion ID not found or you are not authorized to edit this suggestion.`, ephemeral: true });
                }
                
                const embed = new EmbedBuilder()
                .setColor('#9c82c5')
                .setTitle(`${user.username}'s Suggestion`)
                .setDescription(newSuggestion)
                .setThumbnail(`${user.displayAvatarURL()}`)
                .setFooter({ text: `Suggestion ID: ${suggestionID}` })
                .setTimestamp();

                const getChannelID = getChannel(db, 'channels');
                const suggestionsChannelID = await getChannelID(interaction.guild.id, 'suggestionsChannel');
                const suggestionsChannel = interaction.guild.channels.cache.get(suggestionsChannelID);

                const suggestionMessage = await suggestionsChannel.messages.fetch(suggestion.messageId).catch(console.error);

                if (!suggestionMessage) {
                    return interaction.reply({ content: `${error} Suggestion message not found.`, ephemeral: true });
                }

                await suggestionMessage.edit({ embeds: [embed] });
                
                const replyEmbed = new EmbedBuilder()
                .setColor('#2ecc70')
                .setTitle('<:granted:1247140301060046907> Successfully edited suggestion!');
    
                const urlButton = new ButtonBuilder()
                .setLabel('Click here to view!')
                .setStyle(ButtonStyle.Link)
                .setURL(`${suggestionMessage.url}`);

                const component = new ActionRowBuilder().addComponents(urlButton);

                return interaction.reply({ embeds: [replyEmbed], components: [component] });
            });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '<:error:1247140297784426567> Error editing suggestion.', ephemeral: true });
        }
    }    
};
