const player = require('./player');
const embeds = require('./embeds');
const buttons = require('./buttons');
const validation = require('./validation');
const autocomplete = require('./autocomplete');

module.exports = {
  player: {
    player: player.player,
    playTrack: player.playTrack,
    buildSuccessMessage: player.buildSuccessMessage,
  },
  embeds: {
    createQueueEmbed: embeds.createQueueEmbed,
    createPreviousEmbed: embeds.createPreviousEmbed,
    createHistoryEmbed: embeds.createHistoryEmbed,
    createLoopEmbed: embeds.createLoopEmbed,
    createPlayingEmbed: embeds.createPlayingEmbed,
    createClearEmbed: embeds.createClearEmbed,
    createPauseEmbed: embeds.createPauseEmbed,
    createShuffleEmbed: embeds.createShuffleEmbed,
    createSkipEmbed: embeds.createSkipEmbed,
    createStopEmbed: embeds.createStopEmbed,
    createVolumeEmbed: embeds.createVolumeEmbed,
    createUptimeEmbed: embeds.createUptimeEmbed,
  },
  buttons: {
    createQueueButtons: buttons.createQueueButtons,
    createPlayingButtons: buttons.createPlayingButtons,
  },
  validation: {
    validateVoiceChannel: validation.validateVoiceChannel,
    isPlaying: validation.isPlaying,
  },
  autocomplete: {
    buildAutocompleteResponse: autocomplete.buildAutocompleteResponse,
    handleAutocomplete: autocomplete.handleAutocomplete,
  }
};