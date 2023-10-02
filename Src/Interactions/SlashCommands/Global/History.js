const { useHistory } = require('discord-player');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'history',
  type: 1,
  description: 'Shows the last 10 played songs with pagination.',
  guildCooldown: 1000,
  run: async (client, interaction) => {
    const history = useHistory(interaction.guildId);

    if (!history)
      return interaction.reply({
        content: `I have **not** played any songs yet.`,
        ephemeral: true,
      });

    const formatTracks = history.tracks.toArray();

    if (formatTracks.length === 0) {
      return interaction.reply({
        content: `There is **no** history to **display**`,
        ephemeral: true,
      });
    }

    const tracks = formatTracks.map((track, idx) => `**${idx + 1})** [${track.title}](${track.url})`);

    const chunkSize = 10;
    const pages = Math.ceil(tracks.length / chunkSize);

    const embeds = [];
    for (let i = 0; i < pages; i++) {
      const start = i * chunkSize;
      const end = start + chunkSize;

      const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('History')
        .setDescription(tracks.slice(start, end).join('\n') || '**No history**')
        .setFooter({
          text: `Page ${i + 1} | Total ${history.tracks.size} tracks`,
        });

      embeds.push(embed);
    }

    if (embeds.length === 1) {
      return interaction.reply({
        embeds: [embeds[0]],
      });
    }

    const prevButton = new ButtonBuilder()
      .setCustomId('prev')
      .setLabel('Previous')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('⬅️');

    const nextButton = new ButtonBuilder()
      .setCustomId('next')
      .setLabel('Next')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('➡️');

    const row = new ActionRowBuilder().addComponents(prevButton, nextButton);

    const message = await interaction.reply({
      embeds: [embeds[0]],
      components: [row],
      fetchReply: true,
    });

    let currentIndex = 0;
    const collector = message.createMessageComponentCollector({
      idle: 60000,
    });

    collector.on('collect', i => {
      i.deferUpdate();

      switch (i.customId) {
        case 'prev':
          currentIndex = currentIndex === 0 ? embeds.length - 1 : currentIndex - 1;
          break;
        case 'next':
          currentIndex = currentIndex === embeds.length - 1 ? 0 : currentIndex + 1;
          break;
        default:
          break;
      }

      message.edit({
        embeds: [embeds[currentIndex]],
        components: [row],
      });
    });

    collector.on('end', () => {
      message.edit({
        components: [],
      });
    });
  },
};
