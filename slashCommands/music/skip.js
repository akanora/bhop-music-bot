const { useQueue } = require("discord-player");
const { ApplicationCommandType } = require("discord.js");

module.exports = {
  name: "skip",
  description: "Skips the current song.",
  type: ApplicationCommandType.ChatInput,
  cooldown: 1000,

  run: async (client, interaction) => {
    const queue = useQueue(interaction.guildId);

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

    queue.node.skip();
    return interaction.reply({
      content: `⏩ | I have **skipped** to the next track`,
    });
  },
};
