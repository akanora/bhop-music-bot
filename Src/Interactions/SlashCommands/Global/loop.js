const { QueueRepeatMode } = require('discord-player');
const { ApplicationCommandOptionType } = require('discord.js');
const { 
  validation: { validateVoiceChannel, isPlaying },
  player: { player },
  embeds: { createLoopEmbed },
} = require('../../../Structures/music');

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
    try {
      await interaction.deferReply();
      const queue = player.nodes.get(interaction.guild.id);
      if (!await validateVoiceChannel(interaction)) return;
      if (!await isPlaying(queue, interaction)) return;

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

      const loopembed = createLoopEmbed(mode, modeName, interaction);

      queue.setRepeatMode(modeValue);
      interaction.followUp({ embeds: [loopembed] });
    } catch (err) {
      interaction.followUp({
        content: `❌ | Ooops... something went wrong, there was an error switching loop mode. Please try again.`,
        ephemeral: true,
      });
    }
  },
};
