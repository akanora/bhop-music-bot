const { EmbedBuilder } = require('discord.js');
const EMBED_COLOR = '#FF0000';

function getUserTag(user) {
  if (!user || typeof user !== 'object') {
    return 'Unknown User';
  }
  
  return user.discriminator !== 0 ? user.tag : user.username;
}

function createQueueEmbed(tracks = [], currentPage = 0, queue = { tracks: { size: 0 } }) {
  const chunkSize = 10;
  return new EmbedBuilder()
    .setColor(EMBED_COLOR)
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
  .setColor(EMBED_COLOR)
  .setTitle(`Playing previous song ⏮️`)
  .setDescription(
    `Returning next to the previous song: ${previousTracks[0].title} ${
      previousTracks[0].queryType != 'arbitrary' ? `([Link](${previousTracks[0].url}))` : ''
    }!`,
  )
  .setTimestamp()
  .setFooter({
    text: `Requested by: ${getUserTag(interaction.user)}`,
  });
}

function createClearEmbed(interaction) {
  return new EmbedBuilder()
  .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
  .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
  .setColor(EMBED_COLOR)
  .setTitle(`Queue clear  `)
  .setDescription(`The entire music queue has been cleared!`)
  .setTimestamp()
  .setFooter({
    text: `Requested by: ${getUserTag(interaction.user)}`,
  });
}

function createHistoryEmbed(tracks, currentPage, history) {
  const chunkSize = 10;
  return new EmbedBuilder()
  .setColor(EMBED_COLOR)
  .setTitle('Tracks History')
  .setDescription(
    tracks.slice(currentPage * chunkSize, (currentPage + 1) * chunkSize).join('\n') || '**No queued songs**',
  )
  .setFooter({
    text: `Requested by: ${getUserTag(interaction.user)}`,
  });
}

function createLoopEmbed(mode, modeName, interaction) {
  return new EmbedBuilder()
  .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
  .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
  .setColor(EMBED_COLOR)
  .setTitle(mode)
  .setDescription(`The loop mode has been set to ${modeName}!`)
  .setTimestamp()
  .setFooter({
    text: `Requested by: ${getUserTag(interaction.user)}`,
  });
}

function createPlayingEmbed(queue, create, interaction) {
  const embed = new EmbedBuilder()
    .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
    .setColor(EMBED_COLOR)
    .setTitle(`Now playing 🎵`)
    .setDescription(
      `${queue.currentTrack.title} ${
        queue.currentTrack.queryType !== 'arbitrary' ? `([Link](${queue.currentTrack.url}))` : ''
      }\n${create}`
    )
    .setTimestamp()
    .setFooter({
      text: `Requested by: ${getUserTag(interaction.user)}`,
    });

  if (queue.currentTrack.thumbnail) {
    embed.setThumbnail(queue.currentTrack.thumbnail);
  }

  return embed;
}

function createPauseEmbed(queue, checkPause, interaction) {
  return new EmbedBuilder()
  .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
  .setThumbnail(queue.currentTrack.thumbnail)
  .setColor(EMBED_COLOR)
  .setTitle(`Song ${checkPause ? 'resumed' : 'paused'} ⏸️`)
  .setDescription(
    `Playback has been **${checkPause ? 'resumed' : 'paused'}**. Currently playing ${queue.currentTrack.title} ${
      queue.currentTrack.queryType != 'arbitrary' ? `([Link](${queue.currentTrack.url}))` : ''
    }!`,
  )
  .setTimestamp()
  .setFooter({
    text: `Requested by: ${getUserTag(interaction.user)}`,
  });
}

function createShuffleEmbed(interaction) {
  return new EmbedBuilder()
  .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
  .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
  .setColor(EMBED_COLOR)
  .setTitle(`Queue shuffle 🔀`)
  .setDescription(`The entire music queue has been shuffled!`)
  .setTimestamp()
  .setFooter({
    text: `Requested by: ${getUserTag(interaction.user)}`,
  });
}

function createSkipEmbed(queue, queuedTracks, interaction) {
  return new EmbedBuilder()
  .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
  .setThumbnail(queue.currentTrack.thumbnail)
  .setColor(EMBED_COLOR)
  .setTitle(`Song skipped ⏭️`)
  .setDescription(
    `Now playing: ${queuedTracks[0].title} ${
      queuedTracks[0].queryType != 'arbitrary' ? `([Link](${queuedTracks[0].url}))` : ''
    }`,
  )
  .setTimestamp()
  .setFooter({
    text: `Requested by: ${getUserTag(interaction.user)}`,
  });
}

function createStopEmbed(interaction) {
 return new EmbedBuilder()
 .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
 .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
 .setColor(EMBED_COLOR)
 .setTitle(`Stopped music 🛑`)
 .setDescription(`Music has been stopped... leaving the channel!`)
 .setTimestamp()
 .setFooter({
  text: `Requested by: ${getUserTag(interaction.user)}`,
});
}

function createVolumeEmbed(vol, interaction) {
  return new EmbedBuilder()
  .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
  .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
  .setColor(EMBED_COLOR)
  .setTitle(`Volume adjusted 🎧`)
  .setDescription(`The volume has been set to **${vol}%**!`)
  .setTimestamp()
  .setFooter({
    text: `Requested by: ${getUserTag(interaction.user)}`,
  });
}

module.exports = { createQueueEmbed, createPreviousEmbed, createClearEmbed, createHistoryEmbed, createLoopEmbed, createPlayingEmbed, createPauseEmbed, createShuffleEmbed, createSkipEmbed, createStopEmbed, createVolumeEmbed };