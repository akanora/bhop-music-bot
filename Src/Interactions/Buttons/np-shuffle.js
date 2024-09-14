const { 
  validation: { validateVoiceChannel, isPlaying },
  player: { player },
  embeds: { createShuffleEmbed },
} = require('../../Structures/music');

module.exports = {
  name: 'np-shuffle',
  run: async (client, interaction) => {
    try {
      await interaction.deferReply();
      const queue = player.nodes.get(interaction.guild.id);
      if (!await validateVoiceChannel(interaction)) return;
      if (!await isPlaying(queue, interaction)) return;

      const shuffleembed = createShuffleEmbed(interaction);
      
      queue.tracks.shuffle();
      interaction.followUp({ embeds: [shuffleembed] });
    } catch (err) {
      interaction.followUp({
        content: `❌ | Ooops... something went wrong, there was an error shuffling the queue. Please try again.`,
        ephemeral: true,
      });
    }
  },
};
