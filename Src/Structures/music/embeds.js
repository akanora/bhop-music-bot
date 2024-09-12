const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function createQueueEmbed(tracks, currentPage, queue) {
  const chunkSize = 10;
  const embed = new EmbedBuilder()
    .setColor('Red')
    .setTitle('Tracks Queue')
    .setDescription(
      tracks.slice(currentPage * chunkSize, (currentPage + 1) * chunkSize).join('\n') || '**No queued songs**'
    )
    .setFooter({
      text: `Page ${currentPage + 1} | Total ${queue.tracks.size} tracks`,
    });
  return embed;
}

function createQueueButtons() {
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

  return new ActionRowBuilder().addComponents(prevButton, nextButton);
}

module.exports = { createQueueEmbed, createQueueButtons };
