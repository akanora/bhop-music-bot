const { useMainPlayer } = require('discord-player');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');

const player = useMainPlayer();
let previousMessageId = null;

const createButton = (id, style, label) => 
  new ButtonBuilder()
    .setCustomId(id)
    .setStyle(style)
    .setLabel(label);

const createEmbed = (clientUser, track, progressBar) => {
  const npEmbed = new EmbedBuilder()
    .setAuthor({ name: clientUser.tag, iconURL: clientUser.displayAvatarURL() })
    .setThumbnail(track.thumbnail)
    .setColor('#FF0000')
    .setTitle('Starting next song... Now Playing 🎵')
    .setDescription(`${track.title}${track.queryType !== 'arbitrary' ? ` ([Link](${track.url}))` : ''}\n${progressBar}`)
    .setTimestamp();

  if (track.requestedBy) {
    const requesterTag = track.requestedBy.discriminator !== 0 ? track.requestedBy.tag : track.requestedBy.username;
    npEmbed.setFooter({ text: `Requested by: ${requesterTag}` });
  }

  return npEmbed;
};

const createComponents = () => [
  new ActionRowBuilder().addComponents(
    createButton('np-delete', 4, '🗑️'),
    createButton('np-back', 1, '⏮️ Previous'),
    createButton('np-pauseresume', 1, '⏯️ Play/Pause'),
    createButton('np-skip', 1, '⏭️ Skip'),
    createButton('np-clear', 1, '🧹 Clear Queue')
  ),
  new ActionRowBuilder().addComponents(
    createButton('np-volumeadjust', 1, '🔊 Adjust Volume'),
    createButton('np-loop', 1, '🔂 Loop Once'),
    createButton('np-shuffle', 1, '🔀 Shuffle Queue'),
    createButton('np-stop', 1, '🛑 Stop Queue')
  )
];

module.exports = {
  name: 'playerStart',
  customEvent: true,
  run: async (client, rootPath) => {
    player.events.on('playerStart', async (queue, track) => {
      const progressBar = queue.node.createProgressBar().replace(/ 0:00/g, ' ◉ LIVE');
      const clientUser = player.client.user;

      const npEmbed = createEmbed(clientUser, track, progressBar);
      const components = createComponents();
      const channel = queue.metadata.channel;

      if (!channel.permissionsFor(channel.guild.members.me).has(PermissionFlagsBits.SendMessages)) {
        console.error(`No permissions to send messages in channel ID: ${channel.id}`);
        return;
      }

      // Delete the previous message if it exists
      if (previousMessageId) {
        try {
          const oldMessage = await channel.messages.fetch(previousMessageId);
          if (oldMessage) await oldMessage.delete();
        } catch (error) {
          console.error(`Failed to delete previous message: ${error.message}`);
        }
      }

      // Send new message and store its ID
      try {
        const msg = await channel.send({
          embeds: [npEmbed],
          components,
        });
        previousMessageId = msg.id;
      } catch (error) {
        console.error(`Failed to send new message: ${error.message}`);
      }
    });
  },
};
