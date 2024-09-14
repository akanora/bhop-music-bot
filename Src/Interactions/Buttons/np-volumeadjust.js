const { ActionRowBuilder, TextInputBuilder, ModalBuilder } = require('discord.js');
const { 
  validation: { validateVoiceChannel, isPlaying },
  player: { player },
  embeds: { createVolumeEmbed },
} = require('../../Structures/music');

module.exports = {
  name: 'np-volumeadjust',
  run: async (client, interaction) => {
    try {
      const queue = player.nodes.get(interaction.guild.id);

      if (!await validateVoiceChannel(interaction)) return;
      if (!await isPlaying(queue, interaction)) return;

      const modal = new ModalBuilder()
        .setCustomId(`adjust_volume_${interaction.guild.id}`)
        .setTitle(`Adjust Volume - Currently at ${queue.node.volume}%`)
        .addComponents([
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('volume-input')
              .setLabel(`Enter new volume (0-100)`)
              .setStyle(1)
              .setMinLength(1)
              .setMaxLength(3)
              .setPlaceholder('Volume (0-100)')
              .setRequired(true),
          ),
        ]);

      await interaction.showModal(modal);

      const filter = i => i.customId === `adjust_volume_${interaction.guild.id}`;
      const submitted = await interaction.awaitModalSubmit({ filter, time: 240000 });

      let vol = submitted.fields.getTextInputValue('volume-input');

      vol = Number(vol);
      if (isNaN(vol) || vol < 0 || vol > 100) {
        return submitted.reply({
          content: '❌ | Volume must be a number between 0 and 100.',
          ephemeral: true,
        });
      }

      queue.node.setVolume(vol);
      const volumeEmbed = createVolumeEmbed(vol, interaction);
      await submitted.reply({ embeds: [volumeEmbed] });

    } catch (err) {
      console.error(err);
      if (interaction.replied) {
        interaction.reply({
          content: `❌ | Oops, something went wrong. Please try again.`,
          ephemeral: true,
        });
      } else {
        interaction.reply({
          content: `❌ | Oops, something went wrong. Please try again.`,
          ephemeral: true,
        });
      }
    }
  },
};