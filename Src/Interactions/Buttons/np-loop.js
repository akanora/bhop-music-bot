const { QueueRepeatMode } = require('discord-player');
const { 
  validation: { validateVoiceChannel, isPlaying },
  player: { player },
  embeds: { createLoopEmbed },
} = require('../../Structures/music');

module.exports = {
  name: 'np-loop',
  run: async (client, interaction) => {
    try {
      await interaction.deferReply();
      const queue = player.nodes.get(interaction.guild.id);
      if (!await validateVoiceChannel(interaction)) return;
      if (!await isPlaying(queue, interaction)) return;

      if (queue.repeatMode === QueueRepeatMode.OFF) {
        const loopmode = QueueRepeatMode.TRACK;
        queue.setRepeatMode(loopmode);

        const mode = 'Loop mode on 🔂';
        const loopembed = createLoopEmbed(mode, "track", interaction);

        interaction.followUp({ embeds: [loopembed] });

        return;
      }
      
      if (queue.repeatMode === QueueRepeatMode.TRACK) {
        const loopmode = QueueRepeatMode.QUEUE;
        queue.setRepeatMode(loopmode);

        const mode = 'Loop mode on 🔂';
        const loopembed = createLoopEmbed(mode, "queue", interaction);

        interaction.followUp({ embeds: [loopembed] });

        return;
      } 
      if (queue.repeatMode === QueueRepeatMode.QUEUE) {
        const loopmode = QueueRepeatMode.AUTOPLAY;
        queue.setRepeatMode(loopmode);

        const mode = 'Loop mode on 🔂';
        const loopembed = createLoopEmbed(mode, "autoplay", interaction);

        interaction.followUp({ embeds: [loopembed] });

        return;
      } 
      if (queue.repeatMode === QueueRepeatMode.AUTOPLAY) {
        const loopmode = QueueRepeatMode.OFF;
        queue.setRepeatMode(loopmode);

        const mode = 'Loop mode off 📴';
        const loopembed = createLoopEmbed(mode, "off", interaction);

        interaction.followUp({ embeds: [loopembed] });

        return;
      } 
    } catch (err) {
      interaction.followUp({
        content: `❌ | Ooops... something went wrong, there was an error switching loop mode. Please try again.`,
        ephemeral: true,
      });
    }
  },
};
