const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction,
  ],
});

const { Player } = require("discord-player");

client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    smoothVolume: true,
    highWaterMark: 1 << 25,
  },
});

const fs = require("fs");
require("dotenv").config(); // remove this line if you are using replit

client.aliases = new Collection();
client.slashCommands = new Collection();

module.exports = client;

for (const handler of fs.readdirSync("./handlers")) {
  require(`./handlers/${handler}`)(client);
}

client.login(process.env.TOKEN);
