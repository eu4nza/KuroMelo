const { EmbedBuilder } = require('discord.js');
const getChannel = require('../../../functions/getChannel');

module.exports = {
    name: 'delete-suggestion',
    description: 'Delete a suggestion',
    public: true,
    admin: true,
    options: [
        {
            name: 'id',
            description: 'Suggestion ID of the suggestion you want to delete',
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

                const replyEmbed = new EmbedBuilder()
                .setTitle('<:granted:1247140301060046907> Successfully deleted suggestion!')
                .setColor('#2ecc70');

                interaction.reply({ embeds: [replyEmbed], ephemeral: true });

                await suggestionMessage.delete();

                db.run('DELETE FROM suggestions WHERE suggestionId = ?', [suggestionID], (err) => {
                    if (err) {
                        console.error(`Error deleting suggestion from database: ${err.message}`);
                    }
                });
            });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '<:error:1211653628142551040> Error deleting suggestion.', ephemeral: true });
        }
    }   
};
