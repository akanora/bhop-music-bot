const { useQueue } = require('discord-player')
const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: 'nowplaying',
  description: 'Displays the current track in an embed.',
  usage: '', //OPTIONAL (for the help cmd)
  examples: [], //OPTIONAL (for the help cmd)
  dir: 'music',
  cooldown: 1, // Cooldown in seconds, by default it's 2 seconds | OPTIONAL
  permissions: [], // OPTIONAL

  run: async (client, interaction) => {
    const queue = useQueue(interaction.guild.id)

    if (!queue) return interaction.reply(`I am not in a voice channel`)
    if (!queue.currentTrack)
      return interaction.reply(`There is no track **currently** playing`)

    await interaction.deferReply()
    const track = queue.currentTrack

    const ts = queue.node.getTimestamp()

    const embed = new EmbedBuilder()
      .setAuthor({
        name: (track.requestedBy ?? interaction.user).username,
        iconURL: (track.requestedBy ?? interaction.user).displayAvatarURL(),
      })
      .setColor('Red')
      .setTitle('💿 Now Playing')
      .setDescription(`[${track.title}](${track.url})`)
      .setThumbnail(track.thumbnail ?? interaction.user.displayAvatarURL())
      .addFields([
        { name: 'Author', value: track.author },
        {
          name: 'Progress',
          value: `${queue.node.createProgressBar()} (${ts?.progress}%)`,
        },
      ])
      .setFooter({
        text: `Ping: ${
          queue.ping
        }ms | Event Loop Lag: ${queue.player.eventLoopLag.toFixed(0)}ms`,
      })

    return interaction.followUp({ embeds: [embed] })
  },
}
