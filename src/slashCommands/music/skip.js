const { useQueue } = require('discord-player')

module.exports = {
  name: 'skip',
  description: 'Skips the current song.',
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
    if (!queue.currentTrack)
      return interaction.reply({
        content: `There is no track **currently** playing`,
        ephemeral: true,
      })

    queue.node.skip()
    return interaction.reply({
      content: `⏩ | I have **skipped** to the next track`,
    })
  },
}
