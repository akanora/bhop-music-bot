const { useQueue, useTimeline } = require('discord-player');
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
    const timeline = useTimeline(interaction.guildId);
    const queue = useQueue(interaction.guildId);
    const volume = interaction.options.getInteger('volume');

    if (!queue)
      return interaction.reply({
        content: `I am not in a voice channel`,
        ephemeral: true,
      });
    if (!queue.currentTrack)
      return interaction.reply({
        content: `There is no track **currently** playing`,
        ephemeral: true,
      });

    timeline.setVolume(volume);
    return interaction.reply({
      content: `I **changed** the volume to: **${timeline.volume}%**`,
    });
  },
};
