const { useQueue, useTimeline } = require("discord-player");
const { ApplicationCommandType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "nowplaying",
  description: "Displays the current track in an embed.",
  type: ApplicationCommandType.ChatInput,
  cooldown: 1000,

  run: async (client, interaction) => {
    const queue = useQueue(interaction.guildId);
    const timeline = useTimeline(interaction.guildId);

    if (!queue)
      return interaction.reply({
        content: `I am **not** in a voice channel`,
        ephemeral: true,
      });
    if (!queue.currentTrack)
      return interaction.reply({
        content: `There is no track **currently** playing`,
        ephemeral: true,
      });

    const track = queue.currentTrack;

    const requestedByString = track.requestedBy.username
      ? `${track.requestedBy.username}#${track.requestedBy.discriminator}`
      : "Someone";

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setColor("#00ff00")
      .setThumbnail(track.thumbnail)
      .addFields([
        { name: "Now playing", value: track.title },
        { name: "Author", value: track.author },
        {
          name: "Progress",
          value: `${queue.node.createProgressBar()} (${
            timeline.timestamp.progress
          }%)`,
        },
      ])
      .setFooter({ text: `Song requested by ${requestedByString}` });

    return interaction.reply({ embeds: [embed] });
  },
};
