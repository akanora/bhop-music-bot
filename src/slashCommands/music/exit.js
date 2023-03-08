const { usePlayer } = require('discord-player')

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
    const player = usePlayer(interaction.guildId)

    if (!player) return interaction.reply('I am not in a voice channel')
    if (!player.queue.currentTrack)
      return interaction.reply('There is no track **currently** playing')

    // Deletes all the songs from the queue and exits the channel
    player.queue.delete()

    await interaction.reply('Why you do this to me?')
  },
}
