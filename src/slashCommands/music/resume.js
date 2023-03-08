const { usePlayer } = require('discord-player')

module.exports = {
  name: 'resume',
  description: 'Resumes the current song.',
  usage: '', //OPTIONAL (for the help cmd)
  examples: [], //OPTIONAL (for the help cmd)
  dir: 'music',
  cooldown: 1, // Cooldown in seconds, by default it's 2 seconds | OPTIONAL
  permissions: [], // OPTIONAL

  run: async (client, interaction) => {
    const player = usePlayer(interaction.guildId)

    if (!player) return interaction.reply('I am not in a voice channel')
    if (!player.queue.currentTrack)
      return interaction.reply('There is no track **currently** playing')

    // Pause the current song
    player.queue.node.resume()

    await interaction.reply('Player has been resumed.')
  },
}
