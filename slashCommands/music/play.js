const { useMasterPlayer } = require("discord-player");
const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");

const player = useMasterPlayer();

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
    const query = interaction.options.getString("query");
    const result = await player.search(query);

    const tracks = result.tracks.slice(0, 10).map((t) => ({
      name: t.author + " - " + t.title,
      value: t.url,
    }));

    return interaction.respond(tracks);
  },

  async run(client, interaction) {
    if (!interaction.isCommand()) return;
    await interaction.deferReply();

    const query = interaction.options.getString("query", true);

    try {
      if (!interaction.member.voice.channel) {
        return interaction.followUp({
          content: "You are not in a voice channel!",
          ephemeral: true,
        });
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
            volume: 80,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 300000,
            leaveOnEnd: true,
            leaveOnEndCooldown: 300000,
          },
        }
      );

      const message = res.track.playlist
        ? `Successfully enqueued **track(s)** from: **${res.track.playlist.title}**`
        : `Successfully enqueued: **${res.track.author} - ${res.track.title}**`;

      return interaction.editReply({ content: message });
    } catch (error) {
      console.error(error);

      return interaction.followUp({
        content: "An error occurred while trying to play the track",
        ephemeral: true,
      });
    }
  },
};
