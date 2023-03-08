# Bhop Music Bot

Bhop Music Bot is a powerful Discord.js 14 music bot that allows users to play, pause, skip, and control the volume of music tracks in their Discord voice channels. It provides a seamless music playback experience for users by using the latest version of Discord.js library to connect to the Discord API.

## Features

- Play, pause, skip, and control volume of music tracks.
- Support for multiple sources for music playback (e.g. YouTube, SoundCloud, Spotify, etc.).
- Queue management and playlist support.
- Robust error handling and user feedback.

## Getting Started

### Prerequisites

To run the bot, you will need to have the following:

- Node.js (v19.7.0 or later)
- Discord.js (v14.7.1 or later)

### Installation

1. Clone this repository to your local machine.
2. Run `npm install` to install all the required dependencies.
3. Edit the `config.js` file to include your Discord bot token.
4. Run `node slash.js` to publish the slash commands to Discord.
5. Run `node index.js` to start the bot.

### Usage

Once the bot is running, you can use the following slash commands to control the music:

- `/play <song name> | <playlist> | <link>`: Plays the specified song from YouTube, Soundcloud, Spotify etc.
- `/pause`: Pauses the current song.
- `/resume`: Resumes the current song.
- `/queue`: Shows the first 10 songs in the queue with pagination.
- `/history`: Shows the last 10 songs in the history with pagination.
- `/clear`: Clears the current queue and removes all enqueued tracks.
- `/skip`: Skips the current song.
- `/previous`: Plays previous track.
- `/exit`: Stops playing music and disconnects from the voice channel.
- `/volume`: Changes the volume of the track and entire queue.
- `/shuffle`: Shuffles the tracks in the queue.


## Contributing

If you find any issues or have suggestions for new features, feel free to create an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE) file for details.
