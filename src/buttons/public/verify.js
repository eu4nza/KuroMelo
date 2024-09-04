const { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { Captcha } = require('captcha-canvas');
const getRole = require('../../functions/getRole');

module.exports = {
    name: 'verify',
    async execute(interaction, db) {
        try {
            const member = await interaction.guild.members.fetch(interaction.user.id);
        
            const getRoleID = getRole(db, 'roles');
            const verifiedRoleID = await getRoleID(interaction.guild.id, 'verifiedRole');
    
            if (member.roles.cache.has(verifiedRoleID)) {
                return interaction.reply({ content: `<:error:1247140297784426567> You're already verified.`, ephemeral: true });
            }
            
            db.get('SELECT timeout FROM captcha WHERE guildId = ? AND userId = ?', [member.guild.id, member.id], async (err, row) => {
                if (err) {
                    console.error(`Error retrieving timeout for ${member.user.tag}: ${err.message}`);
                    return;
                }

                const currentTime = Math.floor(new Date() / 1000);
                const timeout = row ? row.timeout : null;

                if (timeout && timeout > currentTime) {
                    return interaction.reply({ content: `<:error:1247140297784426567> Maximum attempts reached for Captcha generation, please try again <t:${timeout}:R>.`, ephemeral: true });
                }

                const captcha = new Captcha();
                captcha.async = true;
                captcha.addDecoy();
                captcha.drawTrace();
                captcha.drawCaptcha();

                const captchaCode = captcha.text;
                const setTimeout = Math.floor(new Date() / 1000) + 60;

                db.run('INSERT OR REPLACE INTO captcha (guildId, userId, captchaCode, timeout) VALUES (?, ?, ?, ?)', [member.guild.id, member.id, captchaCode, setTimeout], (err) => {
                    if (err) {
                        console.error(`Error inserting or replacing captcha code and timeout for ${member.user.tag}: ${err.message}`);
                    }
                });

                const attachment = new AttachmentBuilder(
                    await captcha.png,
                    { name: 'captcha.png' }
                );

                const embed = new EmbedBuilder()
                .setColor('#9c82c5')
                .setTitle('Solve the Captcha to get Verified')
                .setImage(`attachment://captcha.png`);
        
                const submitButton = new ButtonBuilder()
                .setLabel('Submit')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('submit')
        
                const component = new ActionRowBuilder().addComponents(submitButton);
        
                return interaction.reply({ embeds: [embed], files: [attachment], components: [component], ephemeral: true });
            });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '<:error:1247140297784426567> Verified role not set.', ephemeral: true });
        }
    }
};
