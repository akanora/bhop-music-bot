const { useQueue } = require('discord-player');
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'volume',
  type: 1,
  description: 'Changes the volume of the track and entire queue.',
  guildCooldown: 1000,
  options: [
    {
      name: 'volume',
      description: 'The amount of volume you want to change to',
      type: ApplicationCommandOptionType.Integer,
      min_value: 0,
      max_value: 100,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const vol = interaction.options.getInteger('volume');
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

    const volumeembed = new EmbedBuilder()
      .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setColor('#FF0000')
      .setTitle(`Volume adjusted 🎧`)
      .setDescription(`The volume has been set to **${vol}%**!`)
      .setTimestamp()
      .setFooter({
        text: `Requested by: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}`,
      });

    try {
      queue.node.setVolume(vol);
      interaction.reply({ embeds: [volumeembed] });
    } catch (err) {
      interaction.reply({
        content: `❌ | Ooops... something went wrong, there was an error adjusting the volume. Please try again.`,
        ephemeral: true,
      });
    }
  },
};
