const { useHistory } = require('discord-player')
const { EmbedBuilder } = require('discord.js')
module.exports = {
  name: 'history',
  description: 'Shows the last 10 songs in the history with pagination.',
  usage: '', //OPTIONAL (for the help cmd)
  examples: [], //OPTIONAL (for the help cmd)
  dir: 'music',
  cooldown: 1, // Cooldown in seconds, by default it's 2 seconds | OPTIONAL
  permissions: [], // OPTIONAL

  run: async (client, interaction) => {
    const history = useHistory(interaction.guild.id)
    if (!history) return interaction.reply(`I am not in a voice channel`)
    if (!history.tracks || !history.currentTrack)
      return interaction.reply(`There is no tracks history`)

    const tracksPerPage = 5
    const tracks = history.tracks
      .toArray()
      .map((track, idx) => `**${++idx})** [${track.title}](${track.url})`)
    const pagesNum = Math.ceil(tracks.length / tracksPerPage)

    if (pagesNum <= 0) return interaction.reply(`There is no tracks history`)

    let currentPage = 0

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('Tracks Queue History')
      .setDescription(tracks.slice(0, tracksPerPage).join('\n'))
      .setFooter({
        text: `Page ${currentPage + 1} of ${pagesNum} | Total ${
          history.tracks.size
        } tracks`,
      })

    const message = await interaction.reply({
      embeds: [embed],
      fetchReply: true,
    })

    if (pagesNum > 1) {
      await message.react('⬅️')
      await message.react('➡️')

      const collector = message.createReactionCollector({
        filter: (reaction, user) =>
          ['⬅️', '➡️'].includes(reaction.emoji.name) &&
          user.id === interaction.user.id,
        time: 60000,
      })

      collector.on('collect', async (reaction) => {
        if (reaction.emoji.name === '⬅️') {
          if (currentPage > 0) {
            currentPage--
            await reaction.users.remove(interaction.user.id).catch(() => {})
          }
        } else if (reaction.emoji.name === '➡️') {
          if (currentPage < pagesNum - 1) {
            currentPage++
            await reaction.users.remove(interaction.user.id).catch(() => {})
          }
        }

        const newEmbed = new EmbedBuilder()
          .setColor('Red')
          .setTitle('Tracks Queue History')
          .setFooter({
            text: `Page ${currentPage + 1} of ${pagesNum} | Total ${
              history.tracks.size
            } tracks`,
          })
          .setDescription(
            tracks
              .slice(
                currentPage * tracksPerPage,
                (currentPage + 1) * tracksPerPage
              )
              .join('\n')
          )

        await message.edit({ embeds: [newEmbed] })
      })

      collector.on('end', () => {
        message.reactions.removeAll().catch(() => {})
      })
    }
  },
}
