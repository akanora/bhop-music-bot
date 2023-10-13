const { useQueue } = require('discord-player');

module.exports = {
  name: 'exit',
  type: 1,
  description: 'Disconnects the bot from the voice channel and deletes the queue.',
  guildCooldown: 1000,
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
