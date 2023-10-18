const { useMainPlayer, QueryType } = require('discord-player');

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
    if (!query) return [];
    const result = await player.search(query);

    const returnData = [];
    if (result.playlist) {
      returnData.push({
        name: 'Playlist | ' + result.playlist.title,
        value: query,
      });
    }

    result.tracks.slice(0, 24).forEach(track => {
      let name = `${track.title} | ${track.author ?? 'Unknown'} (${track.duration ?? 'n/a'})`;
      if (name.length > 100) name = `${name.slice(0, 97)}...`;

      let url = track.url;
      if (url.length > 100) url = url.slice(0, 100);
      return returnData.push({
        name,
        value: url,
      });
    });

    await interaction.respond(returnData);
  },
  run: async (client, interaction) => {
    await interaction.deferReply();
    const query = interaction.options.getString('query', true);

    try {
      if (!interaction.member.voice.channelId)
        return await interaction.followUp({ content: '❌ | You are not in a voice channel!', ephemeral: true });
      if (
        interaction.guild.members.me.voice.channelId &&
        interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId
      )
        return await interaction.followUp({ content: '❌ | You are not in my voice channel!', ephemeral: true });

      const searchResult = await player.search(query, { requestedBy: interaction.user, searchEngine: QueryType.AUTO });

      if (!searchResult || searchResult.tracks.length == 0 || !searchResult.tracks) {
        return interaction.followUp({
          content: `❌ | Ooops... something went wrong, couldn't find the song with the requested query.`,
          ephemeral: true,
        });
      }

      const res = await player.play(interaction.member.voice.channel.id, searchResult, {
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

      return interaction.followUp({
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
