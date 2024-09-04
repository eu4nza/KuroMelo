const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const path = require('path');

module.exports = async function registerCommands(client, publicGuildID, friendsGuildID, boizGuildID, applicationID, token) {
    const publicCommands = [];
    const friendsCommands = [];
    const boizCommands = [];

    const readCommands = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                readCommands(filePath);
            } else if (file.endsWith('.js')) {
                const command = require(filePath);
                if (command.name && command.description) {
                    const commandData = {
                        name: command.name,
                        description: command.description,
                        options: command.options || [],
                    };
                    if (command.global) {
                        publicCommands.push(commandData);
                        friendsCommands.push(commandData);
                        boizCommands.push(commandData);
                    } else if (command.public) {
                        publicCommands.push(commandData);
                    } else if (command.friends) {
                        friendsCommands.push(commandData);
                    } else if (command.boiz) {
                        boizCommands.push(commandData);
                    }
                }
            }
        }
    };

    readCommands(path.join(__dirname, '../commands'));

    const rest = new REST({ version: '9' }).setToken(token);

    try {
        await Promise.all([
            rest.put(Routes.applicationGuildCommands(applicationID, publicGuildID), { body: publicCommands }),
        ]);
        console.log('Commands registered successfully.');
    } catch (error) {
        console.error(error);
    }
};