module.exports = function getChannel(db, tableName) {
  return function getChannelIDFromTable(guildID, channelKey) {
    return new Promise((resolve, reject) => {
      const query = `SELECT channelId FROM ${tableName} WHERE guildId = ? AND channelKey = ?`;
      db.get(query, [guildID, channelKey], (err, row) => {
        if (err) {
          console.error(err.message);
          reject(null);
        }
        if (row && row.channelId) {
          resolve(row.channelId);
        } else {
          reject(null);
        }
      });
    });
  };
}