const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function createQueueButtons() {
  const prevButton = new ButtonBuilder().setCustomId('prev').setLabel('Previous').setStyle(ButtonStyle.Secondary).setEmoji('⬅️');
  const nextButton = new ButtonBuilder().setCustomId('next').setLabel('Next').setStyle(ButtonStyle.Secondary).setEmoji('➡️');

  return new ActionRowBuilder().addComponents(prevButton, nextButton);
}

function createPlayingButtons() {
  const actionbutton = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('np-delete').setStyle(4).setLabel('🗑️'),
    new ButtonBuilder().setCustomId('np-back').setStyle(1).setLabel('⏮️ Previous'),
    new ButtonBuilder().setCustomId('np-pauseresume').setStyle(1).setLabel('⏯️ Play/Pause'),
    new ButtonBuilder().setCustomId('np-skip').setStyle(1).setLabel('⏭️ Skip'),
    new ButtonBuilder().setCustomId('np-clear').setStyle(1).setLabel('🧹 Clear Queue'),
  );

  const actionbutton2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('np-volumeadjust').setStyle(1).setLabel('🔊 Adjust Volume'),
    new ButtonBuilder().setCustomId('np-loop').setStyle(1).setLabel('🔂 Loop Once'),
    new ButtonBuilder().setCustomId('np-shuffle').setStyle(1).setLabel('🔀 Shuffle Queue'),
    new ButtonBuilder().setCustomId('np-stop').setStyle(1).setLabel('🛑 Stop Queue'),
  );

  return [actionbutton, actionbutton2];
}


module.exports = { createQueueButtons, createPlayingButtons };