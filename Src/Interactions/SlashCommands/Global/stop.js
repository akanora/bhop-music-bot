const { 
  validation: { validateVoiceChannel, isPlaying },
  player: { player },
  embeds: { createStopEmbed },
} = require('../../../Structures/music');


module.exports = {
  name: 'stop',
  type: 1,
  description: 'Disconnects the bot from the voice channel and deletes the queue.',
  guildCooldown: 1000,
  run: async (client, interaction) => {
    try {
      await interaction.deferReply();
      const queue = player.nodes.get(interaction.guild.id);
      if (!await validateVoiceChannel(interaction)) return;
      if (!await isPlaying(queue, interaction)) return;

      const stopembed = createStopEmbed(interaction)

      queue.delete();
      interaction.followUp({ embeds: [stopembed] });
    } catch (err) {
      interaction.followUp({
        content: `❌ | Ooops... something went wrong, there was an error stopping the queue. Please try again.`,
        ephemeral: true,
      });
    }
  },
};
