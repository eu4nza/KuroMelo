module.exports = {
    name: 'purge-amount',
    description: 'Delete a specified amount of messages',
    admin: true,
    global: true,
    options: [
        {
            name: 'amount',
            description: 'Amount of messages to delete.',
            type: 4,
            required: true,
        }
    ],
    async execute(interaction) {
        
        const amount = interaction.options.getInteger('amount');
        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: 'Please provide a purge amount between 1 and 100.', ephemeral: true });
        }

        try {
            const fetched = await interaction.channel.messages.fetch({ limit: amount });
            await interaction.channel.bulkDelete(fetched);
            interaction.reply({ content: `Successfully deleted ${amount} messages.`, ephemeral: true });
        } catch (error) {
            console.error('Error purging messages:', error);
            interaction.reply({ content: 'There was an error while purging messages.', ephemeral: true });
        }
    }
}