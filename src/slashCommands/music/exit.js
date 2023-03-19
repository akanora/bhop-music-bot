const { useQueue } = require('discord-player')

module.exports = {
  name: 'exit',
  description:
    'Disconnects the bot from the voice channel and deletes the queue',
  usage: '', //OPTIONAL (for the help cmd)
  examples: [], //OPTIONAL (for the help cmd)
  dir: 'music',
  cooldown: 1, // Cooldown in seconds, by default it's 2 seconds | OPTIONAL
  permissions: [], // OPTIONAL

  run: async (client, interaction) => {
    const queue = useQueue(interaction.guildId)

    if (!queue)
      return interaction.reply({
        content: `I am **not** in a voice channel`,
        ephemeral: true,
      })

    queue.delete()
    return interaction.reply({
      content: `I have **successfully disconnected** from the voice channel`,
    })
  },
}
