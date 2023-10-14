const { useQueue } = require('discord-player');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
  name: 'nowplaying',
  type: 1,
  description: 'Displays the current track in an embed.',
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

    const progress = queue.node.createProgressBar();
    var create = progress.replace(/ 0:00/g, ' ◉ LIVE');

    const npembed = new EmbedBuilder()
      .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
      .setThumbnail(queue.currentTrack.thumbnail)
      .setColor('#FF0000')
      .setTitle(`Now playing 🎵`)
      .setDescription(
        `${queue.currentTrack.title} ${
          queue.currentTrack.queryType != 'arbitrary' ? `([Link](${queue.currentTrack.url}))` : ''
        }\n${create}`,
      )
      .setTimestamp();

    if (queue.currentTrack.requestedBy != null) {
      npembed.setFooter({
        text: `Requested by: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}`,
      });
    }

    var finalComponents = [
      (actionbutton = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('np-delete').setStyle(4).setLabel('🗑️'),
        //.addOptions(options)
        new ButtonBuilder().setCustomId('np-back').setStyle(1).setLabel('⏮️ Previous'),
        new ButtonBuilder().setCustomId('np-pauseresume').setStyle(1).setLabel('⏯️ Play/Pause'),
        new ButtonBuilder().setCustomId('np-skip').setStyle(1).setLabel('⏭️ Skip'),
        new ButtonBuilder().setCustomId('np-clear').setStyle(1).setLabel('🧹 Clear Queue'),
      )),
      (actionbutton2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('np-volumeadjust').setStyle(1).setLabel('🔊 Adjust Volume'),
        new ButtonBuilder().setCustomId('np-loop').setStyle(1).setLabel('🔂 Loop Once'),
        new ButtonBuilder().setCustomId('np-shuffle').setStyle(1).setLabel('🔀 Shuffle Queue'),
        new ButtonBuilder().setCustomId('np-stop').setStyle(1).setLabel('🛑 Stop Queue'),
      )),
    ];

    interaction.reply({ embeds: [npembed], components: finalComponents });
  },
};
