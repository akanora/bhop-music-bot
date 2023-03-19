const { useQueue } = require("discord-player");
const { ApplicationCommandType } = require("discord.js");

module.exports = {
  name: "shuffle",
  description: "Shuffles the tracks in the queue.",
  type: ApplicationCommandType.ChatInput,
  cooldown: 1000,

  run: async (client, interaction) => {
    const queue = useQueue(interaction.guild.id);
    if (!queue)
      return interaction.reply({
        content: `I am **not** in a voice channel`,
        ephemeral: true,
      });

    if (queue.tracks.size < 2)
      return interaction.reply({
        content: `There are not **enough tracks** in queue to **shuffle**`,
        ephemeral: true,
      });

    queue.tracks.shuffle();
    return interaction.reply({
      content: `I have **shuffled** the queue`,
    });
  },
};
