const { EmbedBuilder, ActionRowBuilder, StringSelectMenuOptionBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    name: 'send-public-roles',
    description: 'Send embed roles on a channel',
    admin: true,
    public: true,
    async execute(interaction) {
        try {
            const embed = new EmbedBuilder()
            .setDescription('### Ping Roles\n<:announcements:1211650139798773821> <@&1192934526633136249>\n- Get notified on server announcements\n\n<:updates:1211650148258811954> <@&1192934611408404490>\n- Get notified on server updates\n\n<:events:1211650144471097364> <@&1213418498676494357>\n- Get notified on server events\n### Color Roles\n<:blue:1210593539541569577> <@&1211641733050277938>\n<:green:1210593541680791634> <@&1211641924880961587>\n<:orange:1210593543752781856> <@&1211641947190599700>\n<:pink:1210593545547812895> <@&1211641979448991745>\n<:red:1210593547565404180> <@&1211641986889687123>\n<:violet:1210593549217959996> <@&1211641994632232960>\n<:yellow:1210593550925045760> <@&1211642052123688970>')
            .setColor('#ffc0cb');
    
            const pingRolesOptions = [
                {
                    label: 'announcements',
                    description: 'Get notified on server announcements',
                    value: 'announcements',
                    emoji: '1211650139798773821'
                },
                {
                    label: 'updates',
                    description: 'Get notified on server updates',
                    value: 'updates',
                    emoji: '1211650148258811954'
                },
                {
                    label: 'events',
                    description: 'Get notified on server events',
                    value: 'events',
                    emoji: '1211650144471097364'
                }
            ];
    
            const pingRoles = new StringSelectMenuBuilder()
                .setCustomId('public-ping-roles')
                .setPlaceholder('Select multiple ping roles')
                .setMinValues(0)
                .setMaxValues(pingRolesOptions.length)
                .addOptions(
                    pingRolesOptions.map(option =>
                        new StringSelectMenuOptionBuilder()
                            .setLabel(option.label)
                            .setDescription(option.description)
                            .setValue(option.value)
                            .setEmoji(option.emoji)
                    )
                );
    
            const colorRolesOptions = [
                {
                    label: 'blue',
                    value: 'blue',
                    emoji: '1210593539541569577'
                },
                {
                    label: 'green',
                    value: 'green',
                    emoji: '1210593541680791634'
                },
                {
                    label: 'orange',
                    value: 'orange',
                    emoji: '1210593543752781856'
                },
                {
                    label: 'pink',
                    value: 'pink',
                    emoji: '1210593545547812895'
                },
                {
                    label: 'red',
                    value: 'red',
                    emoji: '1210593547565404180'
                },
                {
                    label: 'violet',
                    value: 'violet',
                    emoji: '1210593549217959996'
                },
                {
                    label: 'yellow',
                    value: 'yellow',
                    emoji: '1210593550925045760'
                }
            ];
    
            const colorRoles = new StringSelectMenuBuilder()
                .setCustomId('public-color-roles')
                .setPlaceholder('Select a color role')
                .setMinValues(0)
                .setMaxValues(1)
                .addOptions(
                    colorRolesOptions.map(option =>
                        new StringSelectMenuOptionBuilder()
                            .setLabel(option.label)
                            .setValue(option.value)
                            .setEmoji(option.emoji)
                    )
                );
    
            const pingRow = new ActionRowBuilder().addComponents(pingRoles);
            const colorRow = new ActionRowBuilder().addComponents(colorRoles);
    
            interaction.channel.send({ embeds: [embed], components: [pingRow, colorRow] });
    
            return interaction.reply({ content: '<:granted:1211653624875454484>', ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '<:error:1211653628142551040> An error occurred, please try again.', ephemeral: true });
        }
    }
};
