const { EmbedBuilder } = require('discord.js');
const getChannel = require('../../functions/getChannel');
const getRole = require('../../functions/getRole');
const getRemainingAttempts = require('../../functions/getRemainingAttempts');

module.exports = {
    name: 'captchaSubmission',
    async execute(interaction, db) {
        try {
            const user = interaction.user;
            const guild = interaction.guild;
            const member = await interaction.guild.members.fetch(user.id);
    
            db.get('SELECT timeout FROM captcha WHERE guildId = ? AND userId = ?', [member.guild.id, member.id], async (err, row) => {
                if (err) {
                    console.error(`Error retrieving timeout for ${member.user.tag}: ${err.message}`);
                    return;
                }
    
                const currentTime = Math.floor(new Date() / 1000);
                const timeout = row ? row.timeout : null;
    
                if (timeout && timeout < currentTime) {
                    return interaction.reply({ content: '<:error:1247140297784426567> Timeout reached for this captcha, please generate a new one.', ephemeral: true });
                }
    
                const getRoleID = getRole(db, 'roles');
                const verifiedRoleID = await getRoleID(interaction.guild.id, 'verifiedRole');
                
                const getChannelID = getChannel(db, 'channels');
                const welcomeChannelID = await getChannelID(guild.id, 'welcomeChannel');
                
                db.get('SELECT captchaCode, attempt FROM captcha WHERE guildId = ? AND userId = ?', [member.guild.id, member.id], (err, row) => {
                    if (err) {
                        console.error(`Error retrieving join captchaCode for ${member.user.tag}: ${err.message}`);
                    } else {
                        const captchaCode = row ? row.captchaCode : null;
                        let attempt = row ? row.attempt : 0;
                        const submission = interaction.fields.getTextInputValue('input');
        
                        if (captchaCode === submission) {
                            db.run('UPDATE captcha SET captchaCode = NULL WHERE guildId = ? AND userId = ?', [member.guild.id, member.id], (updateErr) => {
                                if (updateErr) {
                                    console.error(`Error updating join captchaCode for ${member.user.tag}: ${updateErr.message}`);
                                }
                            });
    
                            const verifiedRole = interaction.guild.roles.cache.get(verifiedRoleID);
                            member.roles.add(verifiedRole);
    
                            if (welcomeChannelID) {
                                const welcomeChannel = guild.channels.cache.get(welcomeChannelID);
            
                                if (welcomeChannel) {
                                    db.get('SELECT * FROM oldmembers WHERE guildId = ? AND userId = ?', [member.guild.id, member.id], (err, row) => {
                                        if (err) {
                                            console.error(`Error checking old members table: ${err.message}`);
                                            return;
                                          }
                                      const isOldMember = !!row;
                                          
                                      guild.members.fetch();
                                      const memberCount = guild.members.cache.filter(member => !member.user.bot).size;
              
                                      const embed = new EmbedBuilder()
                                      .setAuthor({ name: isOldMember ? `Welcome back to ${guild.name}!`:`Welcome to ${guild.name}!`, iconURL: member.user.displayAvatarURL()})
                                      .setDescription('* Please read the <#1139098399589810206> before chatting.\n* Get roles in <#1205820826784505896>.')
                                      .setFooter({ text: `Member #${memberCount}` })
                                      .setColor('#9c82c5');
              
                                      welcomeChannel.send({ content: `${user}`, embeds: [embed] });

                                      db.run('INSERT OR REPLACE INTO oldmembers (guildId, userId) VALUES (?, ?)', [member.guild.id, user.id], (err) => {
                                        if (err) {
                                          console.error(`Error inserting or replacing oldmember for ${user.user.tag}: ${err.message}`);
                                        }
                                      });
                                    });
                                }
                            }
                            return interaction.reply({ content: '<:granted:1247140301060046907> Correct Captcha, successfully verified!', ephemeral: true });
                        } else {
                            attempt++;
                            const remainingAttempts = getRemainingAttempts(attempt);
                            db.run('UPDATE captcha SET attempt = ? WHERE guildId = ? AND userId = ?', [attempt, member.guild.id, member.id], (updateErr) => {
                                if (updateErr) {
                                    console.error(`Error updating attempt count for ${member.user.tag}: ${updateErr.message}`);
                                } else if (attempt >= 3) {
                                    return interaction.reply({ content: '<<:error:1247140297784426567> You have exceeded the maximum attempts for this Captcha, please generate a new one.', ephemeral: true });
                                }
                                return interaction.reply({ content: `<:error:1247140297784426567> Incorrect Captcha, ${remainingAttempts}`, ephemeral: true });
                            });
                        }
                    }
                });
            });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '<:error:1247140297784426567> An error occurred, please try again.', ephemeral: true });
        }
    }
}