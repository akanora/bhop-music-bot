const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed } = require('discord.js');

function createQueueEmbed(tracks = [], currentPage = 0, queue = { tracks: { size: 0 } }) {
  const chunkSize = 10;
  return new EmbedBuilder()
    .setColor('Red')
    .setTitle('Tracks Queue')
    .setDescription(
      tracks.slice(currentPage * chunkSize, (currentPage + 1) * chunkSize).join('\n') || '**No queued songs**'
    )
    .setFooter({
      text: `Page ${currentPage + 1} | Total ${queue.tracks.size} tracks`,
    });
}

function createPreviousEmbed(previousTracks, interaction ) {
  return new EmbedBuilder()
  .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
  .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
  .setColor('#FF0000')
  .setTitle(`Playing previous song ⏮️`)
  .setDescription(
    `Returning next to the previous song: ${previousTracks[0].title} ${
      previousTracks[0].queryType != 'arbitrary' ? `([Link](${previousTracks[0].url}))` : ''
    }!`,
  )
  .setTimestamp()
  .setFooter({
    text: `Requested by: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}`,
  });
}

function createClearEmbed(interaction) {
  return new EmbedBuilder()
  .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
  .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
  .setColor('#FF0000')
  .setTitle(`Queue clear  `)
  .setDescription(`The entire music queue has been cleared!`)
  .setTimestamp()
  .setFooter({
    text: `Requested by: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}`,
  });
}

function createHistoryEmbed(tracks, currentPage, history) {
  const chunkSize = 10;
  return new EmbedBuilder()
  .setColor('Red')
  .setTitle('Tracks History')
  .setDescription(
    tracks.slice(currentPage * chunkSize, (currentPage + 1) * chunkSize).join('\n') || '**No queued songs**',
  )
  .setFooter({
    text: `Page ${currentPage + 1} | Total ${history.tracks.size} tracks`,
  });
}

function createLoopEmbed(mode, modeName, interaction) {
  return new EmbedBuilder()
  .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
  .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
  .setColor('#FF0000')
  .setTitle(mode)
  .setDescription(`The loop mode has been set to ${modeName}!`)
  .setTimestamp()
  .setFooter({
    text: `Requested by: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}`,
  });
}

function createPlayingEmbed(queue, create, interaction) {
  const embed = new EmbedBuilder()
    .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
    .setColor('#FF0000')
    .setTitle(`Now playing 🎵`)
    .setDescription(
      `${queue.currentTrack.title} ${
        queue.currentTrack.queryType !== 'arbitrary' ? `([Link](${queue.currentTrack.url}))` : ''
      }\n${create}`
    )
    .setTimestamp();

  // Conditionally set the thumbnail
  if (queue.currentTrack.thumbnail) {
    embed.setThumbnail(queue.currentTrack.thumbnail);
  }

  // Use requestedBy for footer if available, otherwise fallback to interaction user
  embed.setFooter({
    text: `Requested by: ${queue.currentTrack.requestedBy?.tag || interaction.user.tag}`,
  });

  return embed;
}

function createPauseEmbed(queue, checkPause, interaction) {
  return new EmbedBuilder()
  .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
  .setThumbnail(queue.currentTrack.thumbnail)
  .setColor('#FF0000')
  .setTitle(`Song ${checkPause ? 'resumed' : 'paused'} ⏸️`)
  .setDescription(
    `Playback has been **${checkPause ? 'resumed' : 'paused'}**. Currently playing ${queue.currentTrack.title} ${
      queue.currentTrack.queryType != 'arbitrary' ? `([Link](${queue.currentTrack.url}))` : ''
    }!`,
  )
  .setTimestamp()
  .setFooter({
    text: `Requested by: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}`,
  });
}

function createShuffleEmbed(interaction) {
  return new EmbedBuilder()
  .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
  .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
  .setColor('#FF0000')
  .setTitle(`Queue shuffle 🔀`)
  .setDescription(`The entire music queue has been shuffled!`)
  .setTimestamp()
  .setFooter({
    text: `Requested by: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}`,
  });
}

function createSkipEmbed(queue, queuedTracks, interaction) {
  return new EmbedBuilder()
  .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
  .setThumbnail(queue.currentTrack.thumbnail)
  .setColor('#FF0000')
  .setTitle(`Song skipped ⏭️`)
  .setDescription(
    `Now playing: ${queuedTracks[0].title} ${
      queuedTracks[0].queryType != 'arbitrary' ? `([Link](${queuedTracks[0].url}))` : ''
    }`,
  )
  .setTimestamp()
  .setFooter({
    text: `Requested by: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}`,
  });
}

function createStopEmbed(interaction) {
 return new EmbedBuilder()
 .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
 .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
 .setColor('#FF0000')
 .setTitle(`Stopped music 🛑`)
 .setDescription(`Music has been stopped... leaving the channel!`)
 .setTimestamp()
 .setFooter({
   text: `Requested by: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}`,
 });
}

function createVolumeEmbed(vol, interaction) {
  return new EmbedBuilder()
  .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
  .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
  .setColor('#FF0000')
  .setTitle(`Volume adjusted 🎧`)
  .setDescription(`The volume has been set to **${vol}%**!`)
  .setTimestamp()
  .setFooter({
    text: `Requested by: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}`,
  });
}

module.exports = { createQueueEmbed, createPreviousEmbed, createClearEmbed, createHistoryEmbed, createLoopEmbed, createPlayingEmbed, createPauseEmbed, createShuffleEmbed, createSkipEmbed, createStopEmbed, createVolumeEmbed };