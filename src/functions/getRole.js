module.exports = function getRole(db, tableName) {
  return function getRoleIDFromTable(guildID, roleKey) {
    return new Promise((resolve, reject) => {
      const query = `SELECT roleId FROM ${tableName} WHERE guildId = ? AND roleKey = ?`;
      db.get(query, [guildID, roleKey], (err, row) => {
        if (err) {
          console.error(err.message);
          reject(null);
        }
        if (row && row.roleId) {
          resolve(row.roleId);
        } else {
          reject(null);
        }
      });
    });
  };
}