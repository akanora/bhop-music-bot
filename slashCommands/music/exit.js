const { useQueue } = require("discord-player");
const { ApplicationCommandType } = require("discord.js");

module.exports = {
  name: "exit",
  description:
    "Disconnects the bot from the voice channel and deletes the queue.",
  type: ApplicationCommandType.ChatInput,
  cooldown: 1000,

  run: async (client, interaction) => {
    const queue = useQueue(interaction.guildId);

    if (!queue)
      return interaction.reply({
        content: `I am **not** in a voice channel`,
        ephemeral: true,
      });

    queue.delete();
    return interaction.reply({
      content: `I have **successfully disconnected** from the voice channel`,
    });
  },
};
