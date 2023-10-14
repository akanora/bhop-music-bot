const { useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'previous',
  type: 1,
  description: 'Plays previous track.',
  guildCooldown: 1000,
  run: async (client, interaction) => {
    const queue = useQueue(interaction.guild.id);

    if (!interaction.member.voice.channelId)
      return await interaction.reply({ content: '❌ | You are not in a voice channel!', ephemeral: true });
    if (
      interaction.guild.members.me.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId
    )
      return await interaction.reply({ content: '❌ | You are not in my voice channel!', ephemeral: true });

    if (!queue || !queue.isPlaying())
      return interaction.reply({ content: `❌ | No music is currently being played!`, ephemeral: true });

    const previousTracks = queue.history.tracks.toArray();
    if (!previousTracks[0])
      return interaction.reply({
        content: `❌ | There is no music history prior to the current song. Please try again.`,
        ephemeral: true,
      });

    const backembed = new EmbedBuilder()
      .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setColor('#FF0000')
      .setTitle(`Playing previous song ⏮️`)
      .setDescription(
        `Returning next to the previous song: ${previousTracks[0].title} ${
          previousTracks[0].queryType != 'arbitrary' ? `([Link](${previousTracks[0].url}))` : ''
        }!`,
      )
      .setTimestamp()
      .setFooter({
        text: `Requested by: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}`,
      });

    try {
      queue.history.back();
      interaction.reply({ embeds: [backembed] });
    } catch (err) {
      interaction.reply({
        content: `❌ | Ooops... something went wrong, there was an error returning to the previous song. Please try again.`,
        ephemeral: true,
      });
    }
  },
};
