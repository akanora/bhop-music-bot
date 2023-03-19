const client = require("..");

client.player.events.on("disconnect", (queue) => {
  queue.metadata.channel.send(
    "I have been **manually disconnected** from the **voice channel**"
  );
});
