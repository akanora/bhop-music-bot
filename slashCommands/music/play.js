const { useMasterPlayer } = require("discord-player");
const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
  name: "play",
  description: "Plays and enqueues track(s) of the query provided.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "query",
      description: "Plays and enqueues track(s) of the query provided.",
      type: ApplicationCommandOptionType.String,
      autocomplete: true,
      required: true,
      choices: [],
    },
  ],

  async autocomplete(interaction) {
    const player = useMasterPlayer();
    const query = interaction.options.getString("query");
    const result = await player.search(query);

    let returnData = [];
    if (result.playlist) {
      returnData.push({
        name: result.playlist.title + " | Playlist",
        value: query,
      });
    }
    result.tracks
      .slice(0, 10)
      .map((track) => returnData.push({ name: track.title, value: track.url }));
    await interaction.respond(returnData);
  },

  async run(client, interaction) {
    if (!interaction.isCommand()) return;
    const player = useMasterPlayer();
    await interaction.deferReply();
    const query = interaction.options.getString("query", true);
    try {
      if (!interaction.member.voice.channel) {
        await interaction.followUp({
          content: "You are not in a voice channel!",
          ephemeral: true,
        });
        return;
      }

      const searchResult = await player.search(query, {
        requestedBy: interaction.user,
      });

      if (!searchResult.hasTracks()) {
        return interaction.followUp(`We found no tracks for ${query}!`);
      }

      const res = await player.play(
        interaction.member.voice.channel.id,
        searchResult,
        {
          nodeOptions: {
            metadata: {
              channel: interaction.channel,
              client: interaction.guild.members.me,
              requestedBy: interaction.user,
            },
            skipOnNoStream: true,
            selfDeaf: true,
            volume: 100,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 300000,
            leaveOnEnd: true,
            leaveOnEndCooldown: 300000,
          },
        }
      );

      return interaction.editReply({
        content: `Successfully enqueued${
          res.track.playlist
            ? ` **track(s)** from: **${res.track.playlist.title}**`
            : `: **${res.track.title}**`
        }`,
      });
    } catch (error) {
      console.log(error);
      await interaction.followUp({
        content: "An **error** has occurred",
        ephemeral: true,
      });
    }
  },
};
