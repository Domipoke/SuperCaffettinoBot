var { SlashCommandBuilder, Interaction, ChannelType } = require("discord.js");
var { createReadStream } = require("node:fs");
var {
  getVoiceConnection,
  StreamType,
  joinVoiceChannel,
  createAudioPlayer,
  NoSubscriberBehavior,
  createAudioResource,
  AudioPlayerStatus,
} = require("@discordjs/voice");
var { join } = require("node:path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Replies with Pong!"),
  /**
   * @param {Interaction} interaction
   */
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;
    const connection = getVoiceConnection(interaction.guildId);
    if (connection) {
      var url = interaction.options.getString("url");
      var r = createAudioResource(
        createReadStream(join(__dirname, "../temp/youtubelastvideo.webm"))
      );
      //var r = createAudioResource(getRS(url))
      const player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Pause,
        },
      });
      r.volume?.setVolume(0.5);
      player.play(r);
      player.on("error", (error) => {
        console.error(error);
      });
      player.on(AudioPlayerStatus.Playing, async () => {
        console.log("The audio player has started playing!");
        console.log(r.started);
        await interaction.reply(
          "Playing: " + url + " Volume: " + (r.volume?.volume ?? "undefined")
        );
      });
      connection.subscribe(player);
    } else {
      interaction.reply("no connection " + interaction.guildId)
    }
  },
};
