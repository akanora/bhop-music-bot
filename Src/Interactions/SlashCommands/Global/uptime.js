const { Util } = require("discord-player")

const { embeds: { createUptimeEmbed } } = require('../../../Structures/music');

module.exports = {
    name: 'uptime',
    type: 1,
    description: 'Show how long the bot has been up',
    guildCooldown: 1000,
    run: async (client, interaction) => {
        try {
            await interaction.deferReply();
            const client = interaction.client;
            const upTime = Util.formatDuration(client.uptime);
            const upSince = new Date(Date.now() - client.uptime);

            const uptimeembed = createUptimeEmbed(upSince, upTime, interaction)

            interaction.followUp({ embeds: [uptimeembed] });
        } catch (err) {
            interaction.followUp({
                content: `❌ | Oops, something went wrong. Please try again.`,
                ephemeral: true,
              });
        }
    },
};
  