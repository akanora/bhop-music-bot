const { QueueRepeatMode, useQueue } = require('discord-player')

const repeatModes = [
  { name: 'Off', value: QueueRepeatMode.OFF },
  { name: 'Track', value: QueueRepeatMode.TRACK },
  { name: 'Queue', value: QueueRepeatMode.QUEUE },
  { name: 'Autoplay', value: QueueRepeatMode.AUTOPLAY },
]

module.exports = {
  name: 'loop',
  description: 'Loops the current playing track or the entire queue.',
  options: [
    {
      name: 'mode',
      description: 'Choose a loop mode.',
      type: 3, // Type 3 is String
      required: true,
      choices: repeatModes.map((mode) => ({
        name: mode.name,
        value: mode.name.toLowerCase(),
      })),
    },
  ],

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

    const modeName = interaction.options.getString('mode', true)
    const mode = repeatModes.find((m) => m.name.toLowerCase() === modeName)

    if (!mode)
      return interaction.reply({
        content: `Invalid loop mode: ${modeName}`,
        ephemeral: true,
      })

    queue.setRepeatMode(mode.value)

    return interaction.reply({
      content: `**${mode.name}** has been **${
        mode.value === queue.repeatMode ? 'enabled' : 'disabled'
      }**`,
    })
  },
}
