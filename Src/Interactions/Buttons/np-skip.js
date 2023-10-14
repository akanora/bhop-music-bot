const { useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'np-skip',
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

    const queuedTracks = queue.tracks.toArray();
    if (!queuedTracks[0])
      return interaction.reply({ content: `❌ | There is no music is currently in the queue!`, ephemeral: true });

    const skipembed = new EmbedBuilder()
      .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
      .setThumbnail(queue.currentTrack.thumbnail)
      .setColor('#FF0000')
      .setTitle(`Song skipped ⏭️`)
      .setDescription(
        `Now playing: ${queuedTracks[0].title} ${
          queuedTracks[0].queryType != 'arbitrary' ? `([Link](${queuedTracks[0].url}))` : ''
        }`,
      )
      .setTimestamp()
      .setFooter({
        text: `Requested by: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}`,
      });

    try {
      queue.node.skip();
      interaction.reply({ embeds: [skipembed] });
    } catch (err) {
      interaction.reply({
        content: `❌ | Ooops... something went wrong, there was an error skipping the song. Please try again.`,
        ephemeral: true,
      });
    }
  },
};
