module.exports = {
  name: 'np-delete',
  run: async (client, interaction) => {
    try {
      interaction.message.delete();
    } catch {
      interaction.reply({
        //can't trust discord XD
        content: `❌ | Oops, something went wrong. Please try again.`,
        ephemeral: true,
      });
    } 
  },
};
