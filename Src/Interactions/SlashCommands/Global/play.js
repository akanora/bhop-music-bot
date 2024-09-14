const { QueryType } = require('discord-player');
const { 
  validation: { validateVoiceChannel },
  player: { player, playTrack, buildSuccessMessage },
  autocomplete: { handleAutocomplete }
} = require('../../../Structures/music');

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
    try {
      await interaction.deferReply();
      const query = interaction.options.getString('query', true);
      
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
      return interaction.followUp({
        content: 'An error occurred while trying to play the track',
        ephemeral: true,
      });
    }
  },
};