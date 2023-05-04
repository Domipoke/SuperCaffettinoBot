
const { getVoiceConnection } = require("@discordjs/voice");
var { SlashCommandBuilder, Interaction, ChannelType } = require("discord.js");
// import { tsCommandFile } from "../class/commands";
module.exports = {
    data: new SlashCommandBuilder()
      .setName("debug")
      .setDescription("Debug "),
    /**
     * @param {import("discord.js").ChatInputCommandInteraction<import("discord.js").CacheType>} interaction 
     */
    async execute(interaction) {
        // var msg = ""
        // var con = getVoiceConnection(interaction.guildId)
        // msg+="CONNECTION\n"
        // msg+=con.state??""
        // msg+=con.ap??""
        // interaction.reply(msg)
    }
}
