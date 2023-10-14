const { QueueRepeatMode, useQueue } = require('discord-player');
const { ApplicationCommandOptionType } = require('discord.js');

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

    if (!queue || !queue.currentTrack) {
      return interaction.reply({
        content: queue ? `There is no track **currently** playing` : `I am **not** in a voice channel`,
        ephemeral: true,
      });
    }

    const modeName = interaction.options.getString('mode', true);
    const modeValue = repeatModes[modeName.toLowerCase()];

    if (modeValue === undefined) {
      return interaction.reply({
        content: `Invalid loop mode: ${modeName}`,
        ephemeral: true,
      });
    }

    queue.setRepeatMode(modeValue);

    return interaction.reply({
      content: `**${modeName.charAt(0).toUpperCase() + modeName.slice(1)}** has been **${
        modeValue === queue.repeatMode ? 'enabled' : 'disabled'
      }**`,
    });
  },
};
