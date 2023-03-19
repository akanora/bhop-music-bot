const client = require("..");

client.player.events.on("playerError", (queue, error, track) => {
  return queue.metadata.channel.send(
    `There was an error with **${track.title}**!`
  );
});
