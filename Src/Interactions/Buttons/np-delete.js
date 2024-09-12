module.exports = {
  name: 'np-delete',
  run: async (client, interaction) => {
    interaction.message.delete();
  },
};
