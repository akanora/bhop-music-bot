const { player } = require('./player');  // Adjust the path as needed

async function handleAutocomplete(interaction) {
  try {
    const query = interaction.options.getString('query');
    if (!query) return [];

    const result = await player.search(query);
    return buildAutocompleteResponse(result, query);
  } catch (error) {
    console.error('Autocomplete error:', error);
    return [];
  }
}

function buildAutocompleteResponse(result, query) {
  const returnData = [];
  if (result.playlist) {
    returnData.push({
      name: `Playlist | ${result.playlist.title}`,
      value: query,
    });
  }

  result.tracks.slice(0, 24).forEach(track => {
    const name = `${track.title} | ${track.author ?? 'Unknown'} (${track.duration ?? 'n/a'})`.slice(0, 97) + '...';
    const value = track.url.slice(0, 100);
    returnData.push({ name, value });
  });

  return returnData;
}

module.exports = { buildAutocompleteResponse, handleAutocomplete };
