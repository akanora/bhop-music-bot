const { 
  validation: { validateVoiceChannel, isPlaying },
  player: { player },
  embeds: { createClearEmbed }
} = require('../../../Structures/music');

module.exports = {
  name: 'clear',
  type: 1,
  description: 'Clears the current queue and removes all enqueued tracks.',
  guildCooldown: 1000,
  run: async (client, interaction) => {
    try {
      await interaction.deferReply();
      const queue = player.nodes.get(interaction.guild.id);
      if (!await validateVoiceChannel(interaction)) return;
      if (!await isPlaying(queue, interaction)) return;

      queue.tracks.clear();
      const clearembed = createClearEmbed(interaction);
      interaction.followUp({ embeds: [clearembed] });
    } catch (err) {
      interaction.followUp({
        content: `❌ | Ooops... something went wrong, there was an error clearing the queue. Please try again.`,
        ephemeral: true,
      });
    }
  },
};