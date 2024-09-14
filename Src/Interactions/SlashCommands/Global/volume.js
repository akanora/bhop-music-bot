const { 
  validation: { validateVoiceChannel, isPlaying },
  player: { player },
  embeds: { createVolumeEmbed },
} = require('../../../Structures/music');
const { ApplicationCommandOptionType } = require('discord.js');

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
    try {
      await interaction.deferReply();
      const queue = player.nodes.get(interaction.guild.id);
      if (!await validateVoiceChannel(interaction)) return;
      if (!await isPlaying(queue, interaction)) return;

      const vol = interaction.options.getInteger('volume');
      const volumeembed = createVolumeEmbed(vol, interaction)

      queue.node.setVolume(vol);
      interaction.followUp({ embeds: [volumeembed] });
    } catch (err) {
      interaction.followUp({
        content: `❌ | Ooops... something went wrong, there was an error adjusting the volume. Please try again.`,
        ephemeral: true,
      });
    }
  },
};
