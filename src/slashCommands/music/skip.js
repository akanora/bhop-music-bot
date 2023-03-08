const { EmbedBuilder } = require('discord.js')
const { usePlayer } = require('discord-player')

module.exports = {
  name: 'skip',
  description: 'Skips the current song.',
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

    const currentSong = player.queue.currentTrack

    // Skip the current song
    player.queue.node.skip()

    // Return an embed to the user saying the song has been skipped
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`${currentSong.title} has been skipped!`)
          .setThumbnail(currentSong.thumbnail),
      ],
    })
  },
}
