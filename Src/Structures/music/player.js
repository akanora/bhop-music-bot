const { useMainPlayer } = require('discord-player');

const player = useMainPlayer();

async function playTrack(interaction, searchResult) {
  return player.play(interaction.member.voice.channel.id, searchResult, {
    nodeOptions: {
      metadata: {
        channel: interaction.channel,
        client: interaction.guild.members.me,
        requestedBy: interaction.user,
      },
      bufferingTimeout: 15000,
      leaveOnStop: true,
      leaveOnStopCooldown: 5000,
      leaveOnEnd: true,
      leaveOnEndCooldown: 15000,
      leaveOnEmpty: true,
      leaveOnEmptyCooldown: 300000,
      skipOnNoStream: true,
    },
  });
}

function buildSuccessMessage(res) {
  return res.track.playlist
    ? `Successfully enqueued **track(s)** from: **${res.track.playlist.title}**`
    : `Successfully enqueued: **${res.track.author} - ${res.track.title}**`;
}

module.exports = { player, playTrack, buildSuccessMessage };
