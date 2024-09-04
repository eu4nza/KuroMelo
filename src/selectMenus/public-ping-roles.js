module.exports = {
    name: 'public-ping-roles',
    async execute(interaction) {
        const choices = interaction.values;
        const member = interaction.member;
        const guild = interaction.guild;

        const roleIDs = {
            'announcements': '1192934526633136249',
            'updates': '1192934611408404490',
            'events' : '1213418498676494357',
        };

        await guild.roles.fetch();

        const rolesToAdd = [];
        const rolesToRemove = [];

        for (const [choice, roleId] of Object.entries(roleIDs)) {
            const role = guild.roles.cache.get(roleId);
            if (!role) {
                interaction.reply({ content: '<:error:1211653628142551040> Chosen role does not exist.', ephemeral: true });
                return;
            }
            if (choices.includes(choice) && !member.roles.cache.has(roleId)) {
                rolesToAdd.push(role);
            } else if (!choices.includes(choice) && member.roles.cache.has(roleId)) {
                rolesToRemove.push(role);
            }
        }

        if (rolesToAdd.length > 0) {
            await member.roles.add(rolesToAdd);
            const addedRoleNames = rolesToAdd.map(role => `<@&${role.id}>`).join(', ');
            interaction.reply({ content: `<:granted:1211653624875454484> **${addedRoleNames} role** was successfully added to you.`, ephemeral: true });
        } else if (rolesToRemove.length > 0) {
            await member.roles.remove(rolesToRemove);
            const removedRoleNames = rolesToRemove.map(role => `<@&${role.id}>`).join(', ');
            interaction.reply({ content: `<:granted:1211653624875454484> **${removedRoleNames} role** was successfully removed from you.`, ephemeral: true });
        } else {
            interaction.reply({ content: '<:error:1211653628142551040> No changes made to your role.', ephemeral: true });
        }
    }
};
