const path = require('path');

module.exports = {
  name: 'reload',
  type: 1,
  description: 'Reloads a command.',
  guildCooldown: 1000,
  ownerOnly: true,
  options: [
    {
      name: 'command',
      description: 'The command to reload.',
      type: 3,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const commandName = interaction.options.getString('command', true).toLowerCase();
    const command = client.slashCommands.get(commandName);

    if (!command) {
      return interaction.reply(`There is no command with name \`${commandName}\`!`);
    }

    const filePath = path.join(__dirname, `${command.name}.js`);

    delete require.cache[require.resolve(filePath)];

    try {
      client.slashCommands.delete(command.name);
      const newCommand = require(filePath);
      client.slashCommands.set(newCommand.name, newCommand);
      await interaction.reply(`Command \`${newCommand.name}\` was reloaded!`);
    } catch (error) {
      console.error(error);
      await interaction.reply(
        `There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``,
      );
    }
  },
};
