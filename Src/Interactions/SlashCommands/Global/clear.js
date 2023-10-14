const { useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'clear',
  type: 1,
  description: 'Clears the current queue and removes all enqueued tracks.',
  guildCooldown: 1000,
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

    const clearembed = new EmbedBuilder()
      .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setColor('#FF0000')
      .setTitle(`Queue clear 🧹`)
      .setDescription(`The entire music queue has been cleared!`)
      .setTimestamp()
      .setFooter({
        text: `Requested by: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}`,
      });

    try {
      queue.tracks.clear();
      interaction.reply({ embeds: [clearembed] });
    } catch (err) {
      interaction.reply({
        content: `❌ | Ooops... something went wrong, there was an error clearing the queue. Please try again.`,
        ephemeral: true,
      });
    }
  },
};
