const { useQueue, useTimeline } = require('discord-player')

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
    const timeline = useTimeline(interaction.guildId)
    const queue = useQueue(interaction.guildId)
    const volume = interaction.options.getInteger('volume')

    if (!queue)
      return interaction.reply({
        content: `I am not in a voice channel`,
        ephemeral: true,
      })
    if (!queue.currentTrack)
      return interaction.reply({
        content: `There is no track **currently** playing`,
        ephemeral: true,
      })

    timeline.setVolume(volume)
    return interaction.reply({
      content: `I **changed** the volume to: **${timeline.volume}%**`,
    })
  },
}
