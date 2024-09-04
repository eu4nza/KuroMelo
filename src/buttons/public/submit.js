const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    name: 'submit',
    async execute(interaction) {
        try {
            const modal = new ModalBuilder()
            .setCustomId('captchaSubmission')
            .setTitle('Captcha Verification');
    
            const input = new TextInputBuilder()
            .setCustomId('input')
            .setLabel('Submit Captcha')
            .setStyle(TextInputStyle.Short);
    
            const component = new ActionRowBuilder().addComponents(input);
    
            modal.addComponents(component);
    
            await interaction.showModal(modal);
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '<:error:1247140297784426567> An error occurred, please try again.', ephemeral: true });
        }
    }
};