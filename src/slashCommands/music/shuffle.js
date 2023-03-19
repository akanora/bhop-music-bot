const { useQueue } = require('discord-player')

module.exports = {
  name: 'shuffle',
  description: 'Shuffles the tracks in the queue.',
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

    if (queue.tracks.size < 2)
      return interaction.reply({
        content: `There are not **enough tracks** in queue to **shuffle**`,
        ephemeral: true,
      })

    queue.tracks.shuffle()
    return interaction.reply({
      content: `I have **shuffled** the queue`,
    })
  },
}
