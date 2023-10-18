const { useMainPlayer } = require('discord-player');
const player = useMainPlayer();
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'playerStart',
  customEvent: true,
  run: async (client, rootPath) => {
    player.events.on('playerStart', async (queue, track) => {
      const progress = queue.node.createProgressBar();
      var createBar = progress.replace(/ 0:00/g, ' ◉ LIVE');

      const npembed = new EmbedBuilder()
        .setAuthor({ name: player.client.user.tag, iconURL: player.client.user.displayAvatarURL() })
        .setThumbnail(queue.currentTrack.thumbnail)
        .setColor('#FF0000')
        .setTitle(`Starting next song... Now Playing 🎵`)
        .setDescription(
          `${queue.currentTrack.title} ${
            track.queryType != 'arbitrary' ? `([Link](${queue.currentTrack.url}))` : ''
          }\n${createBar}`,
        )
        .setTimestamp();

      if (queue.currentTrack.requestedBy != null) {
        npembed.setFooter({
          text: `Requested by: ${
            queue.currentTrack.requestedBy.discriminator != 0
              ? queue.currentTrack.requestedBy.tag
              : queue.currentTrack.requestedBy.username
          }`,
        });
      }

      var finalComponents = [
        (actionbutton = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('np-delete').setStyle(4).setLabel('🗑️'),
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

      //Check if bot has message perms
      if (!queue.guild.members.me.permissionsIn(queue.metadata.channel).has(PermissionFlagsBits.SendMessages))
        return console.log(`No Perms! (ID: ${queue.guild.id})`);
      var msg = await queue.metadata.channel.send({
        embeds: [npembed],
        components: finalComponents,
      });

      //----- Dyanmic Button Removal (main drawback being efficiency, but benefit being that it will only remove buttons once the next songs begins, ensuring they always stay) -----
      const filter = collectorMsg => {
        if (collectorMsg.embeds[0]) {
          if (
            collectorMsg.embeds[0].title == 'Starting next song... Now Playing 🎵' ||
            collectorMsg.embeds[0].title == 'Stopped music 🛑' ||
            collectorMsg.embeds[0].title == 'Disconnecting 🛑' ||
            collectorMsg.embeds[0].title == 'Ending playback 🛑' ||
            collectorMsg.embeds[0].title == 'Queue Finished 🛑'
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      };
      const collector = queue.metadata.channel.createMessageCollector({
        filter,
        limit: 1,
        time: queue.currentTrack.durationMS * 3,
      });

      //Remove the buttons if the next song event runs (due to song skip... etc)
      collector.on('collect', async () => {
        try {
          msg.edit({ components: [] });
        } catch (err) {
          console.log(`Now playing msg no longer exists! (ID: ${queue.guild.id})`);
        }
      });

      //Remove the buttons once it expires
      collector.on('end', async () => {
        try {
          msg.edit({ components: [] });
        } catch (err) {
          console.log(`Now playing msg no longer exists! (ID: ${queue.guild.id})`);
        }
      });
    });
  },
};
