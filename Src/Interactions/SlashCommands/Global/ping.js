module.exports = {
  name: 'ping',
  type: 1,
  description: 'Pong',
  guildCooldown: 1000,
  run: async (client, interaction) => {
    interaction.reply({
      content: `Ping is ${client.ws.ping}ms.`,
    });
  },
};
