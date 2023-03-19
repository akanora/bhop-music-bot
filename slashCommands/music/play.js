const { useMasterPlayer } = require("discord-player");
const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
  name: "play",
  description: "Plays and enqueues track(s) of the query provided.",
  type: ApplicationCommandType.ChatInput,
  cooldown: 1000,
  options: [
    {
      name: "query",
      description: "Plays and enqueues track(s) of the query provided.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const player = useMasterPlayer();
    const query = interaction.options.getString("query", true);
    const results = await player.search(query);
    if (!results.hasTracks())
      return interaction.reply({
        content: `**No** tracks were found for your query`,
        ephemeral: true,
      });

    await interaction.deferReply();

    try {
      const res = await player.play(
        interaction.member.voice.channel.id,
        results,
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
      await interaction.editReply({
        content: `An **error** has occurred`,
      });
      return console.log(error);
    }
  },
};
