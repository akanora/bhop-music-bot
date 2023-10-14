const { useMainPlayer } = require('discord-player');

const player = useMainPlayer();

module.exports = {
  name: 'play',
  type: 1,
  description: 'Plays and enqueues track(s) of the query provided.',
  guildCooldown: 1000,
  options: [
    {
      name: 'query',
      description: 'Plays and enqueues track(s) of the query provided.',
      type: 3,
      autocomplete: true,
      required: true,
    },
  ],
  autocomplete: async interaction => {
    const query = interaction.options.getString('query');
    let returnData = [];
    if (query) {
      const result = await player.search(query);
      if (result.playlist) {
        const title =
          result.playlist.title.length > 100
            ? result.playlist.title.substring(0, 90) + '..(truncated)..'
            : result.playlist.title;
        returnData.push({ name: `${title} | Playlist`, value: query });
      }
      for (const track of result.tracks.slice(0, 6)) {
        returnData.push({ name: track.title, value: track.url });
      }
    }
    await interaction.respond(returnData);
  },
  run: async (client, interaction) => {
    await interaction.deferReply();

    const query = interaction.options.getString('query', true);

    try {
      const memberVoiceChannel = interaction.member.voice.channel;
      const botVoiceChannel = interaction.guild.members.me.voice.channel;

      if (!memberVoiceChannel) {
        return interaction.followUp({
          content: 'You are not in a voice channel!',
          ephemeral: true,
        });
      }

      if (botVoiceChannel && memberVoiceChannel.id !== botVoiceChannel.id) {
        await interaction.followUp({
          content: 'You are not in my voice channel!',
          ephemeral: true,
        });
        return;
      }

      const searchResult = await player.search(query, { requestedBy: interaction.user });

      if (!searchResult.hasTracks()) {
        return interaction.followUp(`We found no tracks for ${query}!`);
      }

      const res = await player.play(memberVoiceChannel.id, searchResult, {
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

      const message = res.track.playlist
        ? `Successfully enqueued **track(s)** from: **${res.track.playlist.title}**`
        : `Successfully enqueued: **${res.track.author} - ${res.track.title}**`;

      return interaction.editReply({
        content: message,
      });
    } catch (error) {
      console.error(error);

      return interaction.followUp({
        content: 'An error occurred while trying to play the track',
        ephemeral: true,
      });
    }
  },
};
