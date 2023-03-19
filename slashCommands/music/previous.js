const { useHistory, useQueue } = require("discord-player");
const { ApplicationCommandType } = require("discord.js");

module.exports = {
  name: "previous",
  description: "Plays previous track.",
  type: ApplicationCommandType.ChatInput,
  cooldown: 1000,

  run: async (client, interaction) => {
    const history = useHistory(interaction.guild.id);
    const queue = useQueue(interaction.guild.id);

    if (!queue)
      return interaction.reply({
        content: `I am **not** in a voice channel`,
        ephemeral: true,
      });

    if (!history.previousTrack)
      return interaction.reply({
        content: `There is **no** previous track in the **history**`,
        ephemeral: true,
      });

    await history.previous();
    return interaction.reply({
      content: `🔁 | I am **replaying** the previous track`,
    });
  },
};
