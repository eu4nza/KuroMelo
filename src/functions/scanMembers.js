module.exports = async function (guild) {
    try {
        await guild.members.fetch();
    } catch (error) {
      console.error(`Error scanning members in ${guild.name}:`, error);
    }
  }