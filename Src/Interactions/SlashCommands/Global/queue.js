const { validateVoiceChannel, player, createQueueEmbed, createQueueButtons } = require('../../../Structures/music');

module.exports = {
  name: 'queue',
  type: 1,
  description: 'Shows the first 10 songs in the queue with pagination.',
  guildCooldown: 1000,
  run: async (client, interaction) => {
    await interaction.deferReply();

    try {
      if (!await validateVoiceChannel(interaction)) return;

      const queue = player.nodes.get(interaction.guildId);
      if (!queue || !queue.isPlaying()) {
        return interaction.followUp({ content: '❌ | No music is currently playing!', ephemeral: true });
      }

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
      console.error(error);
      return interaction.followUp({
        content: 'An error occurred while trying to show the queue',
        ephemeral: true,
      });
    }
  },
};