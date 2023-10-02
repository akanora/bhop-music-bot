const { useQueue } = require('discord-player');

module.exports = {
  name: 'skip',
  type: 1,
  description: 'Skips the current song.',
  guildCooldown: 1000,
  run: async (client, interaction) => {
    const queue = useQueue(interaction.guildId);

    if (!queue)
      return interaction.reply({
        content: `I am **not** in a voice channel`,
        ephemeral: true,
      });
    if (!queue.currentTrack)
      return interaction.reply({
        content: `There is no track **currently** playing`,
        ephemeral: true,
      });

    queue.node.skip();
    return interaction.reply({
      content: `⏩ | I have **skipped** to the next track`,
    });
  },
};
