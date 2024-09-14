const { 
  validation: { validateVoiceChannel, isPlaying },
  player: { player },
  embeds: { createPreviousEmbed },
} = require('../../../Structures/music');

module.exports = {
  name: 'previous',
  type: 1,
  description: 'Plays previous track.',
  guildCooldown: 1000,
  run: async (client, interaction) => {
    try {
      await interaction.deferReply();
      const queue = player.nodes.get(interaction.guild.id);
      if (!await validateVoiceChannel(interaction)) return;
      if (!await isPlaying(queue, interaction)) return;

      const previousTracks = queue.history.tracks.toArray();
      if (!previousTracks[0])
        return interaction.followUp({
          content: `❌ | There is no music history prior to the current song. Please try again.`,
          ephemeral: true,
        });

      const backembed = createPreviousEmbed(previousTracks, interaction);

      queue.history.back();
      interaction.followUp({ embeds: [backembed] });
    } catch (err) {
      interaction.followUp({
        content: `❌ | Ooops... something went wrong, there was an error returning to the previous song. Please try again.`,
        ephemeral: true,
      });
    }
  },
};
