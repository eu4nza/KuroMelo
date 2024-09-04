const { PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');
const getRole = require('../functions/getRole');

const commands = {};
const buttons = {};
const selectMenus = {};
const modals = {};

const commandsDirectory = path.join(__dirname, '../commands');
const buttonsDirectory = path.join(__dirname, '../buttons');
const selectMenusDirectory = path.join(__dirname, '../selectMenus');
const modalsDirectory = path.join(__dirname, '../modals');

loadCommands(commandsDirectory);
loadButtons(buttonsDirectory);
loadSelectMenus(selectMenusDirectory);
loadModals(modalsDirectory);

module.exports = async (interaction, db, client, publicGuildID, friendsGuildID, boizGuildID) => {
    const { commandName, customId, member } = interaction;
    const deniedEmoji = '<:denied:1211653626611896420>';
    
    const getStaffRoleID = getRole(db, 'roles');
    const staffRoleID = await getStaffRoleID(interaction.guild.id, 'staffRole').catch(console.error);
    const moderatorRoleID = await getStaffRoleID(interaction.guild.id, 'moderatorRole').catch(console.error);

    if (interaction.isCommand()) {
        const command = commands[commandName];
        if (!command)return new Error("Code is empty for this command");

        if (command.admin && !(member.permissions.has(PermissionsBitField.Flags.Administrator) || member.permissions.has(PermissionsBitField.Flags.ManageGuild))) {
            return interaction.reply({ content: `${deniedEmoji} You do not have permission to use this command.`, ephemeral: true }).catch(console.error);
        }

        if (command.moderator && !(member.permissions.has(PermissionsBitField.Flags.Administrator) || member.permissions.has(PermissionsBitField.Flags.ManageGuild) || member.roles.cache.has(moderatorRoleID))) {
            return interaction.reply({ content: `${deniedEmoji} You do not have permission to use this command.`, ephemeral: true }).catch(console.error);
        }

        if (command.staff && !(member.permissions.has(PermissionsBitField.Flags.Administrator) || member.permissions.has(PermissionsBitField.Flags.ManageGuild) || member.roles.cache.has(moderatorRoleID) || member.roles.cache.has(staffRoleID))) {
            return interaction.reply({ content: `${deniedEmoji} You do not have permission to use this command.`, ephemeral: true }).catch(console.error);
        }

        command.execute(interaction, db, publicGuildID, friendsGuildID, boizGuildID);
    }

    if (interaction.isButton()) {
        const button = buttons[customId];
        if (!button) return new Error('Code is empty for this button');

        if (button.admin && !(member.permissions.has(PermissionsBitField.Flags.Administrator) || member.permissions.has(PermissionsBitField.Flags.ManageGuild))) {
            return interaction.reply({ content: `${deniedEmoji} You do not have permission to use this command.`, ephemeral: true }).catch(console.error);
        }

        if (button.moderator && !(member.permissions.has(PermissionsBitField.Flags.Administrator) || member.permissions.has(PermissionsBitField.Flags.ManageGuild) || member.roles.cache.has(moderatorRoleID))) {
            return interaction.reply({ content: `${deniedEmoji} You do not have permission to use this command.`, ephemeral: true }).catch(console.error);
        }

        if (button.staff && !(member.permissions.has(PermissionsBitField.Flags.Administrator) || member.permissions.has(PermissionsBitField.Flags.ManageGuild) || member.roles.cache.has(moderatorRoleID) || member.roles.cache.has(staffRoleID))) {
            return interaction.reply({ content: `${deniedEmoji} You do not have permission to use this command.`, ephemeral: true }).catch(console.error);
        }

        button.execute(interaction, db, client);
    }

    if (interaction.isStringSelectMenu()) {
        const selectMenu = selectMenus[customId];
        if (!selectMenu) return new Error('Code is empty for this select menu');

        selectMenu.execute(interaction);
    }

    if (interaction.isModalSubmit()) {
        const modal = modals[customId];
        if (!modal) return new Error('Code is empty for this modal');

        modal.execute(interaction, db);
    }
};

function loadCommands(directory) {
    const commandFiles = fs.readdirSync(directory, { withFileTypes: true });
    for (const file of commandFiles) {
        if (file.isDirectory()) {
            loadCommands(path.join(directory, file.name));
        } else if (file.isFile() && file.name.endsWith('.js')) {
            const command = require(path.join(directory, file.name));
            commands[command.name] = command;
        }
    }
}

function loadButtons(directory) {
    const buttonFiles = fs.readdirSync(directory, { withFileTypes: true });
    for (const file of buttonFiles) {
        if (file.isDirectory()) {
            loadButtons(path.join(directory, file.name));
        } else if (file.isFile() && file.name.endsWith('.js')) {
            const button = require(path.join(directory, file.name));
            buttons[button.name] = button;
        }
    }
}

function loadSelectMenus(directory) {
    const selectMenuFiles = fs.readdirSync(directory, { withFileTypes: true });
    for (const file of selectMenuFiles) {
        if (file.isDirectory()) {
            loadSelectMenus(path.join(directory, file.name));
        } else if (file.isFile() && file.name.endsWith('.js')) {
            const selectMenu = require(path.join(directory, file.name));
            selectMenus[selectMenu.name] = selectMenu;
        }
    }
}

function loadModals(directory) {
    const modalFiles = fs.readdirSync(directory, { withFileTypes: true });
    for (const file of modalFiles) {
        if (file.isDirectory()) {
            loadModals(path.join(directory, file.name));
        } else if (file.isFile() && file.name.endsWith('.js')) {
            const modal = require(path.join(directory, file.name));
            modals[modal.name] = modal;
        }
    }
}