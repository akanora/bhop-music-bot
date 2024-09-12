const { QueryType } = require('discord-player');
const { 
  validateVoiceChannel, 
  playTrack, 
  buildSuccessMessage, 
  player 
} = require('../../../Structures/music');
const { handleAutocomplete } = require('../../../Structures/music/autocomplete');

module.exports = {
  name: 'play',
  type: 1,
  description: 'Plays and enqueues track(s) of the query provided.',
  guildCooldown: 1000,
  options: [
    {
      name: 'query',
      description: 'Plays and enqueues track(s) of the query provided.',
      type: 3,
      autocomplete: true,
      required: true,
    },
  ],
  autocomplete: async interaction => {
    const results = await handleAutocomplete(interaction);
    await interaction.respond(results);
  },
  run: async (client, interaction) => {
    await interaction.deferReply();
    const query = interaction.options.getString('query', true);

    try {
      if (!await validateVoiceChannel(interaction)) return;

      const searchResult = await player.search(query, { requestedBy: interaction.user, searchEngine: QueryType.AUTO });
      if (!searchResult?.tracks?.length) {
        return interaction.followUp({
          content: `❌ | Couldn't find the song with the requested query.`,
          ephemeral: true,
        });
      }

      const res = await playTrack(interaction, searchResult);
      const message = buildSuccessMessage(res);

      return interaction.followUp({ content: message });
    } catch (error) {
      console.error(error);
      return interaction.followUp({
        content: 'An error occurred while trying to play the track',
        ephemeral: true,
      });
    }
  },
};