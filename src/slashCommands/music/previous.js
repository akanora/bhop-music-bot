const { useHistory } = require('discord-player')

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

    if (!history)
      return interaction.reply({
        content: `I am not in a voice channel`,
        ephemeral: true,
      })

    if (!history.previousTrack)
      return interaction.reply({
        content: 'No previous track in history!',
        ephemeral: true,
      })

    await interaction.deferReply()

    await history.previous()

    return interaction.followUp({
      content: `⏯ | I have skipped to the previous track`,
    })
  },
}
