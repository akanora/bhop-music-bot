const { useQueue, useTimeline } = require('discord-player');

module.exports = {
  name: 'pause',
  type: 1,
  description: 'Pauses or resumes the current track.',
  guildCooldown: 1000,
  run: async (client, interaction) => {
    const queue = useQueue(interaction.guildId);
    const timeline = useTimeline(interaction.guildId);

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

    // Pause the current song
    timeline.paused ? timeline.resume() : timeline.pause();
    const state = timeline.paused;
    return interaction.reply({
      content: `**Playback** has been **${state ? 'paused' : 'resumed'}**`,
    });
  },
};
