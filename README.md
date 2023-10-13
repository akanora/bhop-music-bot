# BHop Music Bot

BHop Music Bot is a Discord bot that can play music in your voice channels. It is built using the Discord.js and Discord-Player libraries.

## Getting Started

1. Clone the repository: `git clone https://github.com/akanora/bhop-music-bot.git`
2. Install dependencies: `npm install` & `sudo apt install ffmpeg`
3. Edit Src/Credentials/Config.js with the following values:
  prefix: ['yourprefix'],
  botToken: 'yourtoken',
  ownerIds: ['yourdiscordid'],
4. Run the bot: `node bot.js`

## Usage

Use the `/play` command to play music in your voice channel. You can provide a query or a link to a YouTube video or playlist.
```
/play <query>
```

Use the `/skip` command to skip the currently playing song.
```
/skip
```
Use the `/queue` command to view the current song queue.
```
/queue
```
Use the `/clear` command to clear the song queue.
```
/clear
```
Use the `/exit` command to make the bot leave the voice channel.
```
/exit
```
## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
