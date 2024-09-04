const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const getChannel = require('../../../functions/getChannel');
const crypto = require('crypto');

module.exports = {
    name: 'suggest',
    description: 'Suggest a suggestion to the server',
    public: true,
    options: [
        {
            name: 'suggestion',
            description: 'Input your suggestion',
            type: 3,
            required: true,
        }
    ],
    async execute(interaction, db) {
        try {
            const user = interaction.user;
            const suggestion = interaction.options.getString('suggestion');

            const suggestionID = crypto.randomBytes(3).toString('hex');

            const embed = new EmbedBuilder()
            .setColor('#9c82c5')
            .setTitle(`${user.username}'s Suggestion`)
            .setDescription(suggestion)
            .setThumbnail(`${user.displayAvatarURL()}`)
            .setFooter({ text: `Suggestion ID: ${suggestionID}` })
            .setTimestamp();

            const getChannelID = getChannel(db, 'channels');
            const guild = interaction.guild;
            const suggestionsChannelID = await getChannelID(guild.id, 'suggestionsChannel');
            const suggestionsChannel = guild.channels.cache.get(suggestionsChannelID);

            const sentMessage = await suggestionsChannel.send({ embeds: [embed] });

            const replyEmbed = new EmbedBuilder()
            .setColor('#2ecc70')
            .setTitle('<:granted:1247140301060046907> Successfully suggested!');

            const urlButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('Click here to view!')
            .setURL(`${sentMessage.url}`);
        
            const component = new ActionRowBuilder().addComponents(urlButton);

            interaction.reply({ embeds: [replyEmbed], components: [component]  });

            sentMessage.react('⬆️');
            sentMessage.react('⬇️');

            const statement = db.prepare('INSERT INTO suggestions (guildId, userId, messageId, suggestionId) VALUES (?, ?, ?, ?)');
            statement.run(guild.id, user.id, sentMessage.id, suggestionID);
            statement.finalize();
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '<:error:1247140297784426567> Suggestion channel is not set.', ephemeral: true });
        }
    }
};