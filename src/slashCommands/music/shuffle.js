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
    if (!queue) return interaction.reply(`I am not in a voice channel`)

    if (queue.tracks.size < 2)
      return interaction.reply(
        `There aren't **enough tracks** in queue to **shuffle**`
      )

    queue.tracks.shuffle()

    return interaction.reply(`I have **shuffled** the queue`)
  },
}
