const { QueueRepeatMode, useQueue } = require('discord-player');
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

const repeatModes = {
  off: QueueRepeatMode.OFF,
  track: QueueRepeatMode.TRACK,
  queue: QueueRepeatMode.QUEUE,
  autoplay: QueueRepeatMode.AUTOPLAY,
};

module.exports = {
  name: 'loop',
  type: 1,
  description: 'Loops the current playing track or the entire queue.',
  guildCooldown: 1000,
  options: [
    {
      name: 'mode',
      description: 'Choose a loop mode.',
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: Object.keys(repeatModes).map(modeName => ({
        name: modeName.charAt(0).toUpperCase() + modeName.slice(1), // Capitalize the mode name
        value: modeName,
      })),
    },
  ],
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

    const modeName = interaction.options.getString('mode', true);
    const modeValue = repeatModes[modeName.toLowerCase()];

    const mode =
      modeName === 'track'
        ? 'Loop mode on 🔂'
        : modeName === 'queue'
        ? 'Loop mode on 🔁'
        : modeName === 'autoplay'
        ? 'Loop mode on 🤖'
        : 'Loop mode off 📴';

    const loopembed = new EmbedBuilder()
      .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setColor('#FF0000')
      .setTitle(mode)
      .setDescription(`The loop mode has been set to ${modeName}!`)
      .setTimestamp()
      .setFooter({
        text: `Requested by: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}`,
      });

    try {
      queue.setRepeatMode(modeValue);
      interaction.reply({ embeds: [loopembed] });
    } catch (err) {
      interaction.reply({
        content: `❌ | Ooops... something went wrong, there was an error switching loop mode. Please try again.`,
        ephemeral: true,
      });
    }
  },
};
