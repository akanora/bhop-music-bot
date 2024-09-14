const { 
  validation: { validateVoiceChannel, isPlaying },
  player: { player },
  embeds: { createClearEmbed },
} = require('../../Structures/music');

module.exports = {
  name: 'np-clear',
  run: async (client, interaction) => {
    try {
      await interaction.deferReply();
      const queue = player.nodes.get(interaction.guild.id);
      if (!await validateVoiceChannel(interaction)) return;
      if (!await isPlaying(queue, interaction)) return;

      const clearembed = createClearEmbed(interaction);

      try {
        queue.tracks.clear();
        interaction.followUp({ embeds: [clearembed] });
      } catch (err) {
        interaction.followUp({
          content: `❌ | Ooops... something went wrong, there was an error clearing the queue. Please try again.`,
          ephemeral: true,
        });
      }
    } catch (err) {
      interaction.followUp({
        content: `❌ | Ooops... something went wrong, there was an error clearing the queue. Please try again.`,
        ephemeral: true,
      });
    }
  },
};
