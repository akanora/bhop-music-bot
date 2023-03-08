const { usePlayer } = require('discord-player')

module.exports = {
  name: 'volume',
  description: 'Changes the volume of the track and entire queue.',
  usage: '', //OPTIONAL (for the help cmd)
  examples: [], //OPTIONAL (for the help cmd)
  dir: 'music',
  cooldown: 1, // Cooldown in seconds, by default it's 2 seconds | OPTIONAL
  permissions: [], // OPTIONAL
  options: [
    {
      name: 'volume',
      description: 'The amount of volume you want to change to',
      type: 4,
      min_value: 0,
      max_value: 100,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const player = usePlayer(interaction.guildId)
    const volume = interaction.options.getInteger('volume')

    if (!player) return interaction.reply('I am not in a voice channel')
    if (!player.queue.currentTrack)
      return interaction.reply('There is no track **currently** playing')

    await interaction.deferReply()
    player.setVolume(volume)
    return interaction.followUp({
      content: `I **changed** the volume to: **${player.volume}%**`,
    })
  },
}
