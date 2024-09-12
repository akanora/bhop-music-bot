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

module.exports = { buildAutocompleteResponse };
