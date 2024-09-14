const { 
  validation: { validateVoiceChannel, isPlaying },
  player: { player },
  embeds: { createPauseEmbed },
} = require('../../../Structures/music');

module.exports = {
  name: 'pause',
  type: 1,
  description: 'Pauses or resumes the current track.',
  guildCooldown: 1000,
  run: async (client, interaction) => {
    try {
      await interaction.deferReply();
      const queue = player.nodes.get(interaction.guild.id);
      if (!await validateVoiceChannel(interaction)) return;
      if (!await isPlaying(queue, interaction)) return;

      var checkPause = queue.node.isPaused();

      const pauseembed = createPauseEmbed(queue, checkPause, interaction);

      queue.node.setPaused(!queue.node.isPaused());
      interaction.followUp({ embeds: [pauseembed] });
    } catch (err) {
      interaction.followUp({
        content: `❌ | Ooops... something went wrong, there was an error ${
          checkPause ? 'resuming' : 'pausing'
        } the song. Please try again.`,
        ephemeral: true,
      });
    }
  },
};
