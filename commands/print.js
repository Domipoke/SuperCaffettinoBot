
var { SlashCommandBuilder, Interaction, ChannelType } = require("discord.js");
// import { tsCommandFile } from "../class/commands";
module.exports = {
    data: new SlashCommandBuilder()
      .setName("print")
      .setDescription("print msg in server. Require /server ")
      .addStringOption((o) =>
        o.setName("msg").setDescription("msg").setRequired(true)
      ),
    /**
     * @param {import("discord.js").ChatInputCommandInteraction<import("discord.js").CacheType>} interaction 
     */
    async execute(interaction) {
        
    }
}
