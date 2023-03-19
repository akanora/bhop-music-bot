const { ApplicationCommandType } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Check bot's ping.",
  type: ApplicationCommandType.ChatInput,
  cooldown: 3000,
  run: async (client, interaction) => {
    const msg = await interaction.reply({ content: `Ping?`, fetchReply: true });

    if (msg) {
      const diff = msg.createdTimestamp - interaction.createdTimestamp;
      const ping = Math.round(client.ws.ping);
      return interaction.editReply(
        `The round trip took **${diff}ms** and the heartbeat being **${ping}ms**`
      );
    }

    return interaction.editReply("Failed to retrieve ping...");
  },
};
