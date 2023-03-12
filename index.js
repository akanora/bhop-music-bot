const { Client, Collection, GatewayIntentBits } = require('discord.js')
const { Player } = require('discord-player')
const client = new Client({
  allowedMentions: { parse: ['users', 'roles'] },
  fetchAllMembers: true,
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
})

//SET COLLECTION
client.commandes = new Collection()
client.slash = new Collection()
client.aliases = new Collection()
cooldowns = new Collection()

//SET UTILS
client.logger = require('./src/utils/logger')
client.color = require('./src/utils/color.js')

//SET CONFIG
client.config = require('./config')

// LOAD THE 4 HANDLERS
;['error', 'slashCommands', 'event'].forEach((file) => {
  require(`./src/utils/handlers/${file}`)(client)
})

// this is the entrypoint for discord-player based application
client.player = new Player(client, {
  ytdlOptions: {
    quality: 'highestaudio',
    smoothVolume: true,
    highWaterMark: 1 << 25,
  },
})

client.player.events.on('playerStart', (queue, track) => {
  queue.metadata.channel.send(`Started playing **${track.title}**!`)
})

client.player.events.on('playerError', (queue, error, track) => {
  return queue.metadata.channel.send(
    `There was an error with **${track.title}**!`
  )
})

client.login(client.config.token)
