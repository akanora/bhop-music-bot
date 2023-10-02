(async () => {
  const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
  const { QuickDB } = require('quick.db');
  const credentialManager = require('./Src/Credentials/Config');
  const dirPath = __dirname;
  const {
    messageCommandsManager,
    eventsManager,
    buttonManager,
    selectMenuManager,
    modalFormsManager,
    slashCommandsManager,
  } = require('./Src/Structures/Managers/Export');
  const { Player } = require('discord-player');

  const botClient = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent, // Only for bots with message content intent access.
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildInvites,
    ],
    partials: [Partials.Channel],
  });

  const player = new Player(botClient);

  await player.extractors.loadDefault();

  player.events.on('playerStart', (queue, track) => {
    // we will later define queue.metadata object while creating the queue
    queue.metadata.channel.send(`Started playing **${track.title}**!`);
  });

  exports.rootPath = dirPath;
  exports.client = botClient;
  exports.guildCooldownDB = new QuickDB({
    filePath: `${dirPath}/guildCooldownDB.sqlite`,
  });
  exports.globalCooldownDB = new QuickDB({
    filePath: `${dirPath}/globalCooldownDB.sqlite`,
  });
  exports.channelCooldownDB = new QuickDB({
    filePath: `${dirPath}/channelCooldownDB.sqlite`,
  });

  botClient.messageCommands = new Collection();
  botClient.messageCommandsAliases = new Collection();
  botClient.events = new Collection();
  botClient.buttonCommands = new Collection();
  botClient.selectMenus = new Collection();
  botClient.modalForms = new Collection();
  botClient.slashCommands = new Collection();

  await messageCommandsManager(botClient, dirPath);
  await eventsManager(botClient, dirPath);
  await buttonManager(botClient, dirPath);
  await selectMenuManager(botClient, dirPath);
  await modalFormsManager(botClient, dirPath);
  await botClient.login(credentialManager.botToken);
  await slashCommandsManager(botClient, dirPath);
})();
