const { useHistory } = require("discord-player");
const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "history",
  description: "Shows the last 10 played songs with pagination.",
  type: ApplicationCommandType.ChatInput,
  cooldown: 1000,
  run: async (client, interaction) => {
    const history = useHistory(interaction.guildId);

    if (!history)
      return interaction.reply({
        content: `I have **not** played any songs yet.`,
        ephemeral: true,
      });

    const formatTracks = history.tracks.toArray();

    if (formatTracks.length === 0) {
      return interaction.reply({
        content: `There is **no** history to **display**`,
        ephemeral: true,
      });
    }

    const tracks = formatTracks.map(
      (track, idx) => `**${idx + 1})** [${track.title}](${track.url})`
    );

    const chunkSize = 10;
    const pages = Math.ceil(tracks.length / chunkSize);

    const embeds = Array.from({ length: pages }, (_, index) => {
      const start = index * chunkSize;
      const end = start + chunkSize;

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("History")
        .setDescription(tracks.slice(start, end).join("\n") || "**No history**")
        .setFooter({
          text: `Page ${index + 1} | Total ${history.tracks.size} tracks`,
        });

      return embed;
    });

    if (embeds.length === 1) {
      return interaction.reply({
        embeds: [embeds[0]],
      });
    }

    const prevButton = new ButtonBuilder()
      .setCustomId("prev")
      .setLabel("Previous")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("⬅️");

    const nextButton = new ButtonBuilder()
      .setCustomId("next")
      .setLabel("Next")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("➡️");

    const row = new ActionRowBuilder().addComponents(prevButton, nextButton);

    const message = await interaction.reply({
      embeds: [embeds[0]],
      components: [row],
      fetchReply: true,
    });

    let currentIndex = 0;
    const collector = message.createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
      idle: 60000,
    });

    collector.on("collect", (i) => {
      i.deferUpdate();

      switch (i.customId) {
        case "prev": {
          if (currentIndex === 0) {
            currentIndex = embeds.length - 1;
          } else {
            currentIndex--;
          }
          break;
        }
        case "next": {
          if (currentIndex === embeds.length - 1) {
            currentIndex = 0;
          } else {
            currentIndex++;
          }
          break;
        }
        default:
          break;
      }

      message.edit({
        embeds: [embeds[currentIndex]],
        components: [row],
      });
    });

    collector.on("end", () => {
      message.edit({
        components: [],
      });
    });
  },
};
