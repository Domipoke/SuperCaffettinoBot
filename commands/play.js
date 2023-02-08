
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
const { Track } = require("../class/Playlist");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play something")
    .addStringOption((o) =>
      o.setName("url").setDescription("Video Url").setRequired(true)
    ),
  /**
   * @param {Interaction} interaction
   */
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;
    const connection = getVoiceConnection(interaction.guildId);
    if (connection) {
      var url = interaction.options.getString("url");
      var t = new Track(url)
      if (!interaction.replied) interaction.reply("Loading...")
      t.play(interaction, connection, createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Pause,
        },
      }))
    } else {
      interaction.reply("no connection " + interaction.guildId)
    }
  },
  /**
	 * 
	 * @param {import("discord.js").Client} client 
	 * @param {{name: string,args: JSON,settings:JSON}} cmd 
	 */
	async serverexecute(client,cmd) {
    var connection = getVoiceConnection(cmd.settings.guildId);
    //var channel;
    if (connection) {
      var url = cmd.args.url;
      var t = new Track(url)
      //if (!interaction.replied) interaction.reply("Loading...")
      t.play(null, connection, createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Pause,
        },
      }))
    }
	}
};
