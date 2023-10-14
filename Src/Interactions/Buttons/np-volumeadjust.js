const { useQueue } = require('discord-player');
const { EmbedBuilder, ActionRowBuilder, TextInputBuilder, ModalBuilder } = require('discord.js');

module.exports = {
  name: 'np-volumeadjust',
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

    const modal = new ModalBuilder()
      .setCustomId(`adjust_volume_${interaction.guild.id}`)
      .setTitle(`Adjsut Volume - Currently at ${queue.node.volume}%`)
      .addComponents([
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('volume-input')
            .setLabel(`What should the new volume be (0-100)?`)
            .setStyle(1)
            .setMinLength(1)
            .setMaxLength(6)
            .setPlaceholder('Your answer...')
            .setRequired(true),
        ),
      ]);

    await interaction.showModal(modal);

    const filter = interaction => interaction.customId.includes(`adjust_volume_${interaction.guild.id}`);
    interaction
      .awaitModalSubmit({ filter, time: 240000 })
      .then(async submit => {
        var userResponse = submit.fields.getTextInputValue('volume-input');

        if (userResponse < 0 || userResponse > 100 || isNaN(userResponse))
          return submit.reply({
            content: '❌ | The volume must be between 0-100, your input was outside of this.',
            ephemeral: true,
          });

        const volumeembed = new EmbedBuilder()
          .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
          .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
          .setColor('#FF0000')
          .setTitle(`Volume adjusted 🎧`)
          .setDescription(`The volume has been set to **${userResponse}%**!`)
          .setTimestamp()
          .setFooter({
            text: `Requested by: ${
              interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username
            }`,
          });

        try {
          queue.node.setVolume(Number(userResponse));
          submit.reply({ embeds: [volumeembed] });
        } catch (err) {
          console.log(err);
          submit.reply({
            content: `❌ | Ooops... something went wrong, there was an error adjusting the volume. Please try again.`,
            ephemeral: true,
          });
        }
      })
      .catch(console.error);
  },
};
