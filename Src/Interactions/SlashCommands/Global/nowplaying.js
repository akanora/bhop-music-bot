const { 
  validation: { validateVoiceChannel, isPlaying },
  player: { player },
  embeds: { createPlayingEmbed },
  buttons: { createPlayingButtons }
} = require('../../../Structures/music');

module.exports = {
  name: 'nowplaying',
  type: 1,
  description: 'Displays the current track in an embed.',
  guildCooldown: 1000,
  run: async (client, interaction) => {
    try {
      await interaction.deferReply();
      const queue = player.nodes.get(interaction.guild.id);
      if (!await validateVoiceChannel(interaction)) return;
      if (!await isPlaying(queue, interaction)) return;

      const progress = queue.node.createProgressBar();
      var create = progress.replace(/ 0:00/g, ' ◉ LIVE');

      const npembed = createPlayingEmbed(queue, create, interaction);

      const finalComponents = createPlayingButtons();

      interaction.followUp({ embeds: [npembed], components: finalComponents });
    } catch (error) {
      return interaction.followUp({
        content: 'An error occurred while trying to show the now playing',
        ephemeral: true,
      });
    }
  },
};
