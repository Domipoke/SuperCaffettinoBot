
var { SlashCommandBuilder, Interaction, ChannelType } = require("discord.js");
var { createReadStream } = require("node:fs");
var {
  getVoiceConnection,
  StreamType,
  joinVoiceChannel,
  createAudioPlayer,
  NoSubscriberBehavior,
  createAudioResource,
  AudioPlayerStatus
} = require("@discordjs/voice");
var { Track } = require("../class/Playlist");
// var { tsCommandFile } = require("../class/commands");

module.exports={
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play something")
    .addStringOption((o) =>
      o.setName("url").setDescription("Video Url").setRequired(true)
    ),
  /**
  * @param {import("discord.js").ChatInputCommandInteraction<import("discord.js").CacheType>} interaction 
  */
  async execute(interaction) {
    /**
     * @/type {import("discord-player").Player}
     */
    //var p = interaction.client.player
    

      if (!interaction.isChatInputCommand()) return;
      
      var connection = getVoiceConnection(interaction.guildId);
      console.log(connection);
      if (!connection) {
        if (interaction) {
          var ch = interaction.channel
          if (ch) {
              var type = ch.type
              if (type==ChannelType.GuildVoice) {
                  var cid = ch.id;
                  var gid = interaction.guildId;
                  var igaC = interaction.guild?.voiceAdapterCreator;
                  if (cid&&gid&&igaC) {
                      connection = joinVoiceChannel({
                          selfDeaf: false,
                          selfMute: false,
                          channelId: cid,
                          guildId: gid,
                          adapterCreator: igaC
                      })
                      if (interaction.replied) await interaction.editReply("Connected")
                      else {await interaction.reply("Connected!")}
                      
                  }
              }
          }
        }
      }
      if (connection) {
        var url = interaction.options.getString("url")??"";
        
        var t = new Track(url)
        if (!interaction.replied) interaction.reply("Loading...")
        t.player(interaction)
        
      } else {
          
        //interaction.reply("no connection " + interaction.guildId)
        
      }
  },

	async serverexecute(client,cmd) {
    var connection = getVoiceConnection(cmd.settings.guildId);
    //var channel;
    if (connection) {
      var url = cmd.args.url??"";
      var t = new Track(url,null)
      //if (!interaction.replied) interaction.reply("Loading...")
      
      t.play(null, connection, createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Pause,
        },
      }))
    }
	}
};

