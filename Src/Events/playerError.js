const { useMainPlayer } = require('discord-player');
const player = useMainPlayer();

module.exports = {
  name: 'playerError',
  customEvent: true,
  run: async (client, rootPath) => {
    player.events.on('playerError', async (queue, error) => {
        console.log(`[${queue.guild.name}] (ID:${queue.metadata.channel}) Error emitted from the player: ${error.message}`);
        queue.metadata.channel.send({ content: '❌ | Failed to extract the following song... skipping to the next!' })
    });
  },
};
