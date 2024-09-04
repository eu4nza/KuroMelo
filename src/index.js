const { Client, IntentsBitField, DiscordAPIError } = require('discord.js');
const createTables = require('./functions/createTables');
const registerCommands = require('./functions/registerCommands');
const { name: addEvent, execute: addEventExecute } = require('./events/guildMemberAdd');
const { name: removeEvent, execute: removeEventExecute } = require('./events/guildMemberRemove');
const interactionCreate = require('./events/interactionCreate');
const handleReady = require('./functions/ready');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.DirectMessages,
  ],
});

require('dotenv').config();

const publicGuildID = process.env.PUBLIC_GUILD_ID;
const friendsGuildID = process.env.FRIENDS_GUILD_ID;
const boizGuildID = process.env.BOIZ_GUILD_ID;
const applicationID = process.env.APPLICATION_ID;
const token = process.env.TOKEN;

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    createTables(db);
  }
});

registerCommands(client, publicGuildID, friendsGuildID, boizGuildID, applicationID, token);

client.on('ready', () => handleReady(client, publicGuildID, friendsGuildID, boizGuildID));
client.on(addEvent, (...args) => addEventExecute(...args, db, client, publicGuildID, friendsGuildID, boizGuildID));
client.on(removeEvent, (...args) => removeEventExecute(...args, db, client, publicGuildID, friendsGuildID, boizGuildID));
client.on('interactionCreate', (interaction) => interactionCreate(interaction, db, client, publicGuildID, friendsGuildID, boizGuildID));

client.on('error', error => {
  if (error instanceof DiscordAPIError) {
    console.error('Discord API error:', error.message);
  }
});

process.on('uncaughtException', error => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

process.on('warning', warning => {
  if (warning.name === 'UncaughtExceptionMonitor') {
    console.warn('Uncaught Exception Monitor warning:', warning);
  }
});

client.login(token);
