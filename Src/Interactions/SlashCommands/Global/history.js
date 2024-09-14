const { useHistory } = require('discord-player');
const { 
  validation: { validateVoiceChannel, isPlaying },
  player: { player },
  embeds: { createHistoryEmbed },
  buttons: { createQueueButtons },
} = require('../../../Structures/music');

module.exports = {
  name: 'history',
  type: 1,
  description: 'Shows the last 10 played songs with pagination.',
  guildCooldown: 1000,
  run: async (client, interaction) => {
    try {
      await interaction.deferReply();
      const history = useHistory(interaction.guildId);
      const queue = player.nodes.get(interaction.guild.id);
      if (!await validateVoiceChannel(interaction)) return;
      if (!await isPlaying(queue, interaction)) return;

      const previousTracks = history.tracks.toArray();
      if (!previousTracks[0])
        return interaction.followUp({
          content: `❌ | There is no music history prior to the current song. Please try again.`,
          ephemeral: true,
        });

      const tracks = previousTracks.map((track, idx) => `**${idx + 1})** [${track.title}](${track.url})`);

      const chunkSize = 10;
      const pages = Math.ceil(tracks.length / chunkSize);

      let currentPage = 0;

      const embed = createHistoryEmbed(tracks, currentPage, queue);

      if (pages === 1) {
        return interaction.followUp({
          embeds: [embed],
        });
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

        const updatedEmbed = createHistoryEmbed(tracks, currentPage, history);

        message.edit({
          embeds: [updatedEmbed],
          components: [row],
        });
      });

      collector.on('end', () => {
        message.edit({
          components: [],
        });
      });
    } catch (error) {
      console.error(error);
      return interaction.followUp({
        content: 'An error occurred while trying to show the history',
        ephemeral: true,
      });
    }
  },
};
