const { useQueue } = require("discord-player");
const { ApplicationCommandType } = require("discord.js");

module.exports = {
  name: "clear",
  description: "Clears the current queue and removes all enqueued tracks.",
  type: ApplicationCommandType.ChatInput,
  cooldown: 1000,

  run: async (client, interaction) => {
    const queue = useQueue(interaction.guild.id);

    if (!queue)
      return interaction.reply({
        content: `I am **not** in a voice channel`,
        ephemeral: true,
      });
    if (queue.tracks.size === 0)
      return interaction.reply({
        content: `There is **nothing** to clear`,
        ephemeral: true,
      });

    queue.tracks.clear();
    return interaction.reply({
      content: `I have **cleared** the queue`,
    });
  },
};
