module.exports = {
    name: 'ping',
    description: 'Very simple ping command',
    usage: '', //OPTIONAL (for the help cmd)
    examples: [], //OPTIONAL (for the help cmd)
    dir: "fun",
    cooldown: 1, // Cooldown in seconds, by default it's 2 seconds | OPTIONAL
    permissions: [], // OPTIONAL
    options: [
        {
            name: 'ping',
            description: "Get the bot's latency",
            type: 3, required: false,
            choices: [ { name: "yes", value: 'true' }, { name: "no", value: 'false' } ]
        }
    ], // OPTIONAL, (/) command options ; read https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
    
    run: async (client, interaction) => {
        if(interaction.options.getString('ping') === 'true') {
            interaction.reply({ content: `Hello world !\n> Bot's latency : **${Math.round(client.ws.ping)}ms**` });
        } else {
            interaction.reply({ content: 'Hello world !' });
        }
    }
}