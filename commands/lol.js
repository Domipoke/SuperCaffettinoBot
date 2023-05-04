
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
var { join } = require("node:path");
const { QueryType } = require("discord-player");
// var { tsCommandFile } = require("../class/commands");

module.exports={
    data: new SlashCommandBuilder()
        .setName("lol")
        .setDescription("lol")
        .addStringOption(function(x){
          var mp = __dirname.split("/")
          mp.pop()
          x.setName("audio").setDescription("audio file").setRequired(true)
          require("node:fs").readdirSync(
            join(mp.join("/"),"src","audio","LoL")
          ).forEach(lkk=>{
            var lk = lkk.split(".ogg").join("")
            x.addChoices({
              name: lk.toString(), value: lk.toString()
            })
          })
          
          return x
        }),
    /**
     * @param {import("discord.js").ChatInputCommandInteraction<import("discord.js").CacheType>} interaction 
     */
    async execute(interaction) {
      if (interaction){
        var a = interaction.options.getString("audio")
        interaction.reply("Playing: "+a)
        /**
         * @type {import("discord-player").Player}
        */
      var pl = interaction.client.player
      var p = join(interaction.client.dir,"src","audio","LoL",a+".ogg")
        //[PUB:REMOVE] id of default channel
        pl.play(interaction.guild.members.me.voice.channel??interaction.channel.id,p,{
          nodeOptions:{
            searchEngine: QueryType.FILE,
            leaveOnEmpty: false,
            leaveOnEmptyCooldown: false,
            leaveOnEnd: false,
            leaveOnEndCooldown: false,
            leaveOnStop: false,
            leaveOnStopCooldown: false,
          },
          searchEngine: QueryType.FILE
        })}
    },
    /**
     * @typedef {{champ: string,event: string,summoner: string, channelId: string}} SlashLoLArgs
     * @param {import("discord.js").Client} client
     * @param {string} cmd 
     * @param {SlashLoLArgs} args 
     */
    async api(client,cmd,args) {
      switch (args.summoner.toLowerCase()) {
        case "domipoke06":
        case "nondomipoke":
          switch (args.champ.toLowerCase()) {
            case "warwick":
              break;
            default:
              break;
          }
          break;
        case "giusfire":
          switch (args.champ.toLowerCase()) {
            case "pyke":
              playAudio(client,cmd,args,"pickachuthunderbolt.ogg")
              break;
            default:
              break;
          }
          break;
        case "kaskodibanane":
          switch (args.champ.toLowerCase()) {

            default:
              break;
          }
          break;
        case "abusivparker":
        case "nonabusivparker":
          switch (args.champ.toLowerCase()) {

            default:
              break;
          }
          break;
        case "bl4ckhydra":
          switch (args.champ.toLowerCase()) {

            default:
              break;
          }
          break;
        default:
          break;
      }
    }
}
/**
 * @param {import("discord.js").Client} client
 * @param {string} cmd 
 * @param {SlashLoLArgs} args 
 * @param {string} path
 */
function playAudio(client,cmd,args,path) {
  /**
  * @type {import("discord-player").Player}
  */
  var pl = client.player
  var p = join(client.dir,"src","audio","LoL",path)
  pl.play(args.channelId,p,{
    nodeOptions:{
      leaveOnEmpty: false,
      leaveOnEmptyCooldown: false,
      leaveOnEnd: false,
      leaveOnEndCooldown: false,
      leaveOnStop: false,
      leaveOnStopCooldown: false,
    },
    searchEngine: QueryType.FILE
  })
}