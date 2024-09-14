async function isPlaying(queue, interaction){
  if (!queue || !queue.isPlaying()) {
    interaction.followUp({ content: `❌ | No music is currently being played!`, ephemeral: true });
    return false;
  }
  return true;
}

async function validateVoiceChannel(interaction) {
  if (!interaction.member.voice.channelId) {
    await interaction.followUp({ content: '❌ | You are not in a voice channel!', ephemeral: true });
    return false;
  }
  if (
    interaction.guild.members.me.voice.channelId &&
    interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId
  ) {
    await interaction.followUp({ content: '❌ | You are not in my voice channel!', ephemeral: true });
    return false;
  }
  return true;
}

module.exports = { validateVoiceChannel, isPlaying };
