const { 
  validation: { validateVoiceChannel, isPlaying },
  player: { player },
  embeds: { createQueueEmbed },
  buttons: { createQueueButtons }
} = require('../../../Structures/music');

module.exports = {
  name: 'queue',
  type: 1,
  description: 'Shows the first 10 songs in the queue with pagination.',
  guildCooldown: 1000,
  run: async (client, interaction) => {
    try {
      await interaction.deferReply();
      const queue = player.nodes.get(interaction.guild.id);
      if (!await validateVoiceChannel(interaction)) return;
      if (!await isPlaying(queue, interaction)) return;

      const queuedTracks = queue.tracks.toArray();
      if (!queuedTracks.length) {
        return interaction.followUp({ content: `❌ | There are no songs currently in the queue!`, ephemeral: true });
      }

      const tracks = queuedTracks.map((track, idx) => `**${idx + 1})** [${track.title}](${track.url})`);
      const pages = Math.ceil(tracks.length / 10);
      let currentPage = 0;

      const embed = createQueueEmbed(tracks, currentPage, queue);

      if (pages === 1) {
        return interaction.followUp({ embeds: [embed] });
      }

      const row = createQueueButtons();

      const message = await interaction.followUp({
        embeds: [embed],
        components: [row],
        fetchReply: true,
      });

      const collector = message.createMessageComponentCollector({
        idle: 60000,
      });

      collector.on('collect', i => {
        i.deferUpdate();

        if (i.customId === 'prev') {
          currentPage = currentPage === 0 ? pages - 1 : currentPage - 1;
        } else if (i.customId === 'next') {
          currentPage = currentPage === pages - 1 ? 0 : currentPage + 1;
        }

        const updatedEmbed = createQueueEmbed(tracks, currentPage, queue);

        message.edit({
          embeds: [updatedEmbed],
          components: [row],
        });
      });

      collector.on('end', () => {
        message.edit({ components: [] });
      });
    } catch (error) {
      return interaction.followUp({
        content: 'An error occurred while trying to show the queue',
        ephemeral: true,
      });
    }
  },
};