const directorySearch = require('node-recursive-directory');
const { REST, Routes } = require('discord.js');
const readFiles = require('../ReadAllFiles');

module.exports = async (client, rootPath) => {
  const globalSlashCommandsFiles = await directorySearch(`${rootPath}/Src/Interactions/SlashCommands/Global`);
  const allGuildsSlashCommandsFiles = readFiles(`${rootPath}/Src/Interactions/SlashCommands/Guilds`);
  const rest = new REST({ version: '10' }).setToken(client.token);

  if (globalSlashCommandsFiles?.length > 0) {
    let AGCOA = []; // All global commands as an array of objects.
    for (const globalFile of globalSlashCommandsFiles) {
      const globalCommand = require(globalFile);
      if (!globalCommand.name || globalCommand.ignore || !globalCommand.run) continue;
      await client.slashCommands.set(globalCommand.name, globalCommand);
      AGCOA.push({
        name: globalCommand.name,
        description: globalCommand.description || '',
        type: globalCommand.type,
        options: globalCommand?.options ?? [],
      });
    }
    try {
      await rest.put(Routes.applicationCommands(client.application.id), { body: AGCOA });
      console.log('Global commands registered successfully.');
    } catch (error) {
      console.error('Error registering global commands:', error);
    }
  }

  if (allGuildsSlashCommandsFiles?.length > 0) {
    for (const guild of allGuildsSlashCommandsFiles) {
      let ASCOA = []; // All commands of this particular guild as an array of objects.
      const guildId = guild.flat(9999)[0].split(`${rootPath}/Src/Interactions/SlashCommands/Guilds`)[1].split('/')[1];
      for (const commandFile of guild.flat(9999)) {
        const guildCommand = require(commandFile);
        if (!guildCommand.name || guildCommand.ignore || !guildCommand.run) continue;
        await client.slashCommands.set(guildCommand.name, guildCommand);
        ASCOA.push({
          name: guildCommand.name,
          description: guildCommand.description || '',
          type: guildCommand.type,
          options: guildCommand?.options ?? [],
        });
      }
      try {
        console.log(`Registering commands for guild ${guildId}:`, ASCOA);
        await rest.put(Routes.applicationGuildCommands(client.application.id, guildId), { body: ASCOA });
        console.log(`Commands for guild ${guildId} registered successfully.`);
      } catch (error) {
        console.error(`Error registering commands for guild ${guildId}:`, error);
      }
    }
  }
};
