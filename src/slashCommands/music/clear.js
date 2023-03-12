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

    if (!queue) return interaction.reply(`I am not in a voice channel`)
    if (!queue.tracks) return interaction.reply(`There is nothing to clear`)

    queue.tracks.clear()
    queue.history.clear()
    return interaction.reply(`I have **cleared** the queue`)
  },
}
