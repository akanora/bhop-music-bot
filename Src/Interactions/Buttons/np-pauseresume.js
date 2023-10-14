const { useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'np-pauseresume',
  run: async (client, interaction) => {
    const queue = useQueue(interaction.guildId);

    if (!interaction.member.voice.channelId)
      return await interaction.reply({ content: '❌ | You are not in a voice channel!', ephemeral: true });
    if (
      interaction.guild.members.me.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId
    )
      return await interaction.reply({ content: '❌ | You are not in my voice channel!', ephemeral: true });

    if (!queue || !queue.isPlaying())
      return interaction.reply({ content: `❌ | No music is currently being played!`, ephemeral: true });
    var checkPause = queue.node.isPaused();

    const pauseembed = new EmbedBuilder()
      .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
      .setThumbnail(queue.currentTrack.thumbnail)
      .setColor('#FF0000')
      .setTitle(`Song ${checkPause ? 'resumed' : 'paused'} ⏸️`)
      .setDescription(
        `Playback has been **${checkPause ? 'resumed' : 'paused'}**. Currently playing ${queue.currentTrack.title} ${
          queue.currentTrack.queryType != 'arbitrary' ? `([Link](${queue.currentTrack.url}))` : ''
        }!`,
      )
      .setTimestamp()
      .setFooter({
        text: `Requested by: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}`,
      });

    try {
      queue.node.setPaused(!queue.node.isPaused());
      interaction.reply({ embeds: [pauseembed] });
    } catch (err) {
      interaction.reply({
        content: `❌ | Ooops... something went wrong, there was an error ${
          checkPause ? 'resuming' : 'pausing'
        } the song. Please try again.`,
        ephemeral: true,
      });
    }
  },
};
