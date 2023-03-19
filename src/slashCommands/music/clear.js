const { useQueue } = require('discord-player')

module.exports = {
  name: 'clear',
  description: 'Clears the current queue and removes all enqueued tracks.',
  usage: '', //OPTIONAL (for the help cmd)
  examples: [], //OPTIONAL (for the help cmd)
  dir: 'music',
  cooldown: 1, // Cooldown in seconds, by default it's 2 seconds | OPTIONAL
  permissions: [], // OPTIONAL

  run: async (client, interaction) => {
    const queue = useQueue(interaction.guild.id)

    if (!queue)
      return interaction.reply({
        content: `I am **not** in a voice channel`,
        ephemeral: true,
      })
    if (queue.tracks.size === 0)
      return interaction.reply({
        content: `There is **nothing** to clear`,
        ephemeral: true,
      })

    queue.tracks.clear()
    return interaction.reply({
      content: `I have **cleared** the queue`,
    })
  },
}
