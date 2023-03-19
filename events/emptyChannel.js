const client = require("..");

client.player.events.on("emptyChannel", (queue, error) => {
  queue.metadata.channel.send(
    "I left the channel after **5 minutes** due to **channel inactivity**"
  );
});
