const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'serverlist',
  type: 1,
  description: 'Shows the server list.',
  ownerOnly: true,
  guildCooldown: 1000,
  ignore: true,
  run: async (client, interaction) => {
    let i0 = 0;
    let i1 = 10;
    let page = 1;

    let description =
      `${client.guilds.cache.size}\n\n` +
      client.guilds.cache
        .sort((a, b) => b.memberCount - a.memberCount)
        .map(r => r)
        .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount}`)
        .slice(0, 10)
        .join('\n');

    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle(`${page}/${Math.ceil(client.guilds.cache.size / 10)}`)
      .setDescription(description);

    const msg = await interaction.channel.send({ embeds: [embed] });

    await msg.react('⬅');
    await msg.react('➡');
    await msg.react('❌');

    const collector = msg.createReactionCollector((reaction, user) => user.id === interaction.author.id);

    collector.on('collect', async reaction => {
      if (reaction._emoji.name === '⬅') {
        // Updates variables
        i0 = i0 - 10;
        i1 = i1 - 10;
        page = page - 1;

        // if there is no guild to display, delete the message
        if (i0 < 0) {
          return msg.delete();
        }
        if (!i0 || !i1) {
          return msg.delete();
        }

        description =
          `${client.guilds.cache.size}\n\n` +
          client.guilds.cache
            .sort((a, b) => b.memberCount - a.memberCount)
            .map(r => r)
            .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount}`)
            .slice(i0, i1)
            .join('\n');

        // Update the embed with new informations
        embed.setTitle(`${page}/${Math.round(client.guilds.cache.size / 10)}`).setDescription(description);

        // Edit the message
        msg.edit({ embeds: [embed] });
      }

      if (reaction._emoji.name === '➡') {
        // Updates variables
        i0 = i0 + 10;
        i1 = i1 + 10;
        page = page + 1;

        // if there is no guild to display, delete the message
        if (i1 > client.guilds.cache.size + 10) {
          return msg.delete();
        }
        if (!i0 || !i1) {
          return msg.delete();
        }

        description =
          `${client.guilds.cache.size}\n\n` +
          client.guilds.cache
            .sort((a, b) => b.memberCount - a.memberCount)
            .map(r => r)
            .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount}`)
            .slice(i0, i1)
            .join('\n');

        // Update the embed with new informations
        embed.setTitle(`${page}/${Math.round(client.guilds.cache.size / 10)}`).setDescription(description);

        // Edit the message
        msg.edit({ embeds: [embed] });
      }

      if (reaction._emoji.name === '❌') {
        return msg.delete();
      }

      // Remove the reaction when the user react to the message
      await reaction.users.remove(interaction.author.id);
    });
  },
};
