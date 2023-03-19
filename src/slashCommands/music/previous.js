const { useHistory, useQueue } = require('discord-player')

module.exports = {
  name: 'previous',
  description: 'Plays previous track.',
  usage: '', //OPTIONAL (for the help cmd)
  examples: [], //OPTIONAL (for the help cmd)
  dir: 'music',
  cooldown: 1, // Cooldown in seconds, by default it's 2 seconds | OPTIONAL
  permissions: [], // OPTIONAL

  run: async (client, interaction) => {
    const history = useHistory(interaction.guild.id)
    const queue = useQueue(interaction.guild.id)

    if (!queue)
      return interaction.reply({
        content: `I am **not** in a voice channel`,
        ephemeral: true,
      })

    if (!history.previousTrack)
      return interaction.reply({
        content: `There is **no** previous track in the **history**`,
        ephemeral: true,
      })

    await history.previous()
    return interaction.reply({
      content: `🔁 | I am **replaying** the previous track`,
    })
  },
}
