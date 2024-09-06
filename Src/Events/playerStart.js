const { useMainPlayer } = require('discord-player');
const player = useMainPlayer();
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'playerStart',
  customEvent: true,
  run: async (client, rootPath) => {
    player.events.on('playerStart', async (queue, track) => {
      const progressBar = queue.node.createProgressBar().replace(/ 0:00/g, ' ◉ LIVE');
      const trackTitle = queue.currentTrack.title;
      const trackUrl = queue.currentTrack.url;
      const requestedBy = queue.currentTrack.requestedBy;
      const isArbitraryQuery = track.queryType === 'arbitrary';
      const thumbnail = queue.currentTrack.thumbnail;
      const clientUser = player.client.user;

      // Create embed
      const npEmbed = new EmbedBuilder()
        .setAuthor({ name: clientUser.tag, iconURL: clientUser.displayAvatarURL() })
        .setThumbnail(thumbnail)
        .setColor('#FF0000')
        .setTitle(`Starting next song... Now Playing 🎵`)
        .setDescription(`${trackTitle}${!isArbitraryQuery ? ` ([Link](${trackUrl}))` : ''}\n${progressBar}`)
        .setTimestamp();

      if (requestedBy) {
        const requesterTag = requestedBy.discriminator !== 0 ? requestedBy.tag : requestedBy.username;
        npEmbed.setFooter({ text: `Requested by: ${requesterTag}` });
      }

      // Create buttons
      const createButton = (id, style, label) => new ButtonBuilder().setCustomId(id).setStyle(style).setLabel(label);

      const actionRow1 = new ActionRowBuilder().addComponents(
        createButton('np-delete', 4, '🗑️'),
        createButton('np-back', 1, '⏮️ Previous'),
        createButton('np-pauseresume', 1, '⏯️ Play/Pause'),
        createButton('np-skip', 1, '⏭️ Skip'),
        createButton('np-clear', 1, '🧹 Clear Queue')
      );

      const actionRow2 = new ActionRowBuilder().addComponents(
        createButton('np-volumeadjust', 1, '🔊 Adjust Volume'),
        createButton('np-loop', 1, '🔂 Loop Once'),
        createButton('np-shuffle', 1, '🔀 Shuffle Queue'),
        createButton('np-stop', 1, '🛑 Stop Queue')
      );

      const components = [actionRow1, actionRow2];

      // Check for message permissions
      if (!queue.guild.members.me.permissionsIn(queue.metadata.channel).has(PermissionFlagsBits.SendMessages)) {
        return console.log(`No Perms! (ID: ${queue.guild.id})`);
      }

      // Send message
      const msg = await queue.metadata.channel.send({
        embeds: [npEmbed],
        components,
      });

      // Create filter for collector
      const filter = (message) => {
        const embedTitle = message.embeds[0]?.title;
        return ['Starting next song... Now Playing 🎵', 'Stopped music 🛑', 'Disconnecting 🛑', 'Ending playback 🛑', 'Queue Finished 🛑'].includes(embedTitle);
      };

      // Create collector
      const collector = queue.metadata.channel.createMessageCollector({
        filter,
        limit: 1,
        time: track.durationMS * 3,
      });

      // Handle collector events
      collector.on('collect', async () => {
        try {
          await msg.edit({ components: [] });
        } catch {
          console.log(`Now playing msg no longer exists! (ID: ${queue.guild.id})`);
        }
      });

      collector.on('end', async () => {
        try {
          await msg.edit({ components: [] });
        } catch {
          console.log(`Now playing msg no longer exists! (ID: ${queue.guild.id})`);
        }
      });
    });
  },
};
