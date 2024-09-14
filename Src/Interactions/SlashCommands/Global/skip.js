const { 
  validation: { validateVoiceChannel, isPlaying },
  player: { player },
  embeds: { createSkipEmbed },
} = require('../../../Structures/music');

module.exports = {
  name: 'skip',
  type: 1,
  description: 'Skips the current song.',
  guildCooldown: 1000,
  run: async (client, interaction) => {
    try {
      await interaction.deferReply();
      const queue = player.nodes.get(interaction.guild.id);
      if (!await validateVoiceChannel(interaction)) return;
      if (!await isPlaying(queue, interaction)) return;

      const queuedTracks = queue.tracks.toArray();
      if (!queuedTracks[0])
        return interaction.followUp({ content: `❌ | There is no music is currently in the queue!`, ephemeral: true });

      const skipembed = createSkipEmbed(queue, queuedTracks, interaction);

      queue.node.skip();
      interaction.followUp({ embeds: [skipembed] });
    } catch (err) {
      interaction.followUp({
        content: `❌ | Ooops... something went wrong, there was an error skipping the song. Please try again.`,
        ephemeral: true,
      });
    }
  },
};
