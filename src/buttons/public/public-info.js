const { EmbedBuilder } = require('discord.js');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'public-info',
    async execute(interaction) {
        try {
            const embedsPath = path.resolve(__dirname, '..', '..', '..', 'embeds.yml');
            
            const embedData = yaml.load(fs.readFileSync(embedsPath, 'utf8'));
            const embed = new EmbedBuilder().setColor('#9c82c5');

            if (embedData['public-info'] && embedData['public-info'].fields) {
                embedData['public-info'].fields.forEach(field => {
                    embed.addFields({
                        name: field.title,
                        value: field.description
                    });
                });
            }

            return interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '<:error:1247140297784426567> An error occurred, please try again.', ephemeral: true });
        }
    }
};
