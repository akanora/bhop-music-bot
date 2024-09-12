const { ActivityType } = require('discord.js');
const bold = import("chalk").then(m=>m.default);
const { rootPath } = require('../../bot');
const { statSync } = require('node:fs');
const directorySearch = require('node-recursive-directory');
module.exports = {
  name: 'ready',
  runOnce: true,
  run: async client => {
    client.user.setActivity('Humans.', {
      type: ActivityType.Watching,
    });

    let allSlashCommands = 0;
    const slashCommandsTotalFiles = await directorySearch(`${rootPath}/Src/Interactions/SlashCommands`);
    await slashCommandsTotalFiles.forEach(cmdFile => {
      if (statSync(cmdFile).isDirectory()) return;
      const slashCmd = require(cmdFile);
      if (!slashCmd.name || slashCmd.ignore || !slashCmd.run) return;
      else allSlashCommands++;
    });

    console.log((await bold).green('[Client] ') + (await bold).blue(`Logged into ${client.user.tag}`));
    if (client.messageCommands.size > 0)
      console.log(
        (await bold).red('[MessageCommands] ') +
        (await bold).cyanBright(
            `Loaded ${client.messageCommands.size} MessageCommands with ${(await bold).white(
              `${client.messageCommandsAliases.size} Aliases`,
            )}.`,
          ),
      );
    if (client.events.size > 0)
      console.log((await bold).yellowBright('[Events] ') + (await bold).magenta(`Loaded ${client.events.size} Events.`));
    if (client.buttonCommands.size > 0)
      console.log(
        (await bold).whiteBright('[ButtonCommands] ') + (await bold).greenBright(`Loaded ${client.buttonCommands.size} Buttons.`),
      );
    if (client.selectMenus.size > 0)
      console.log((await bold).red('[SelectMenus] ') + (await bold).blueBright(`Loaded ${client.selectMenus.size} SelectMenus.`));
    if (client.modalForms.size > 0)
      console.log((await bold).cyanBright('[ModalForms] ') + (await bold).yellowBright(`Loaded ${client.modalForms.size} Modals.`));
    if (allSlashCommands > 0)
      console.log((await bold).magenta('[SlashCommands] ') + (await bold).white(`Loaded ${allSlashCommands} SlashCommands.`));
  },
};
