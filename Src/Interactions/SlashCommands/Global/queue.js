const { useQueue } = require('discord-player');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'queue',
  type: 1,
  description: 'Shows the first 10 songs in the queue with pagination.',
  guildCooldown: 1000,
  run: async (client, interaction) => {
    const queue = useQueue(interaction.guildId);

    if (!interaction.member.voice.channelId)
      return await interaction.reply({ content: '❌ | You are not in a voice channel!', ephemeral: true });
    if (
      interaction.guild.members.me.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId
    )
      return await interaction.reply({ content: '❌ | You are not in my voice channel!', ephemeral: true });

    const queuedTracks = queue.tracks.toArray();
    if (!queuedTracks[0])
      return interaction.reply({ content: `❌ | There is no music is currently in the queue!`, ephemeral: true });

    const tracks = queuedTracks.map((track, idx) => `**${idx + 1})** [${track.title}](${track.url})`);

    const chunkSize = 10;
    const pages = Math.ceil(tracks.length / chunkSize);

    let currentPage = 0;

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('Tracks Queue')
      .setDescription(
        tracks.slice(currentPage * chunkSize, (currentPage + 1) * chunkSize).join('\n') || '**No queued songs**',
      )
      .setFooter({
        text: `Page ${currentPage + 1} | Total ${queue.tracks.size} tracks`,
      });

    if (pages === 1) {
      return interaction.reply({
        embeds: [embed],
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
      embeds: [embed],
      components: [row],
      fetchReply: true,
    });

    const collector = message.createMessageComponentCollector({
      idle: 60000,
    });

    collector.on('collect', i => {
      i.deferUpdate();

      switch (i.customId) {
        case 'prev':
          currentPage = currentPage === 0 ? pages - 1 : currentPage - 1;
          break;
        case 'next':
          currentPage = currentPage === pages - 1 ? 0 : currentPage + 1;
          break;
        default:
          break;
      }

      embed
        .setDescription(
          tracks.slice(currentPage * chunkSize, (currentPage + 1) * chunkSize).join('\n') || '**No queued songs**',
        )
        .setFooter({
          text: `Page ${currentPage + 1} | Total ${queue.tracks.size} tracks`,
        });

      message.edit({
        embeds: [embed],
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
