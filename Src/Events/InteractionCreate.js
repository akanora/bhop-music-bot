const commandOptionsProcessor = require('../Structures/CommandOptions/Processor');

async function handleInteraction(interaction, client) {
  const slashCommand = client.slashCommands.get(interaction.commandName);

  if (interaction.type === 4 && slashCommand?.autocomplete) {
    try {
      const choices = [];
      await slashCommand.autocomplete(interaction, choices);
    } catch (error) {
      console.error('Autocomplete error:', error);
      return;
    }
  }

  if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
    if (!slashCommand) return;
    return handleCommand(interaction, client, slashCommand);
  }

  if (interaction.isAnySelectMenu()) {
    const selectMenuCommand = client.selectMenus.get(interaction.values[0]) ?? client.selectMenus.get(interaction.customId);
    if (!selectMenuCommand) return;
    return handleCommand(interaction, client, selectMenuCommand, 'SelectMenu');
  }

  if (interaction.isButton()) {
    const buttonInteraction = client.buttonCommands.get(interaction.customId);
    if (!buttonInteraction) return;
    return handleCommand(interaction, client, buttonInteraction, 'Button');
  }

  if (interaction.isModalSubmit()) {
    const modalInteraction = client.modalForms.get(interaction.customId);
    if (!modalInteraction) return;
    return handleCommand(interaction, client, modalInteraction, 'ModalForm');
  }
}

async function handleCommand(interaction, client, command, type = 'SlashCommand') {
  try {
    const authenticatedCMDOptions = await commandOptionsProcessor(
      client,
      interaction,
      command,
      true,
      type,
    );

    if (authenticatedCMDOptions) {
      await command.run(client, interaction);
    }
  } catch (error) {
    console.error(`${type} command error:`, error);
  }
}

module.exports = {
  name: 'interactionCreate',
  run: handleInteraction,
};
