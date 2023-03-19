const { useQueue, useTimeline } = require('discord-player')

module.exports = {
  name: 'pause',
  description: 'Pauses the current song.',
  usage: '', //OPTIONAL (for the help cmd)
  examples: [], //OPTIONAL (for the help cmd)
  dir: 'music',
  cooldown: 1, // Cooldown in seconds, by default it's 2 seconds | OPTIONAL
  permissions: [], // OPTIONAL

  run: async (client, interaction) => {
    const queue = useQueue(interaction.guildId)
    const timeline = useTimeline(interaction.guildId)

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

    // Pause the current song
    timeline.paused ? timeline.resume() : timeline.pause()
    const state = timeline.paused
    return interaction.reply({
      content: `**Playback** has been **${state ? 'paused' : 'resumed'}**`,
    })
  },
}
