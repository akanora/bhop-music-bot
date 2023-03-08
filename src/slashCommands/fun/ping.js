module.exports = {
  name: 'ping',
  description: 'Returns the round trip and heartbeat',
  usage: '', //OPTIONAL (for the help cmd)
  examples: [], //OPTIONAL (for the help cmd)
  dir: 'fun',
  cooldown: 1, // Cooldown in seconds, by default it's 2 seconds | OPTIONAL
  permissions: [], // OPTIONAL

  run: async (client, interaction) => {
    const msg = await interaction.reply({ content: `Ping?`, fetchReply: true })

    if (msg) {
      const diff = msg.createdTimestamp - interaction.createdTimestamp
      const ping = Math.round(client.ws.ping)
      return interaction.editReply(
        `The round trip took **${diff}ms** and the heartbeat being **${ping}ms**`
      )
    }

    return interaction.editReply('Failed to retrieve ping...')
  },
}
