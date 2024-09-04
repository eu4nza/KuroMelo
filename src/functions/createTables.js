module.exports = function createTables(db) {
  const tables = [
    { name: 'channels', schema: 'guildId TEXT, channelId TEXT PRIMARY KEY, channelKey TEXT' },
    { name: 'captcha', schema: 'guildId TEXT, userId TEXT, captchaCode TEXT, attempt INTEGER DEFAULT 0, timeout INTEGER, PRIMARY KEY(guildId, userId)' },
    { name: 'jointimestamp', schema: 'guildId TEXT, userId TEXT, joinTimestamp INTEGER, PRIMARY KEY(guildId, userId)' },
    { name: 'oldmembers', schema: 'guildId TEXT, userId TEXT, PRIMARY KEY(guildId, userId)' },
    { name: 'roles', schema: 'guildId TEXT, roleId TEXT PRIMARY KEY, roleKey TEXT' },
    { name: 'suggestions', schema: 'guildId TEXT, userId TEXT, messageId TEXT, suggestionId TEXT PRIMARY KEY' }
  ];
  tables.forEach((table) => {
    db.run(`CREATE TABLE IF NOT EXISTS ${table.name} (${table.schema})`, (err) => {
      if (err) {
        console.error(`Error creating table ${table.name}: ${err.message}`);
      }
    });
  });
};
