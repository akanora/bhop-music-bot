const { QueueRepeatMode, useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'np-loop',
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

    if (queue.repeatMode === QueueRepeatMode.TRACK) {
      const loopmode = QueueRepeatMode.OFF;
      queue.setRepeatMode(loopmode);

      const mode = 'Loop mode off 📴';
      const loopembed = new EmbedBuilder()
        .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setColor('#FF0000')
        .setTitle(mode)
        .setDescription(`The loop mode has been set to **off**!`)
        .setTimestamp()
        .setFooter({
          text: `Requested by: ${
            interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username
          }`,
        });

      interaction.reply({ embeds: [loopembed] });
    } else {
      const loopmode = QueueRepeatMode.TRACK;
      queue.setRepeatMode(loopmode);

      const mode = 'Loop mode on 🔂';
      const loopembed = new EmbedBuilder()
        .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setColor('#FF0000')
        .setTitle(mode)
        .setDescription(`The loop mode has been set to the **current track**!`)
        .setTimestamp()
        .setFooter({
          text: `Requested by: ${
            interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username
          }`,
        });

      interaction.reply({ embeds: [loopembed] });
    }
  },
};
