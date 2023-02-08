
var { SlashCommandBuilder, Interaction, ChannelType } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
      .setName("print")
      .setDescription("print msg in server. Require /server ")
      .addStringOption((o) =>
        o.setName("msg").setDescription("msg").setRequired(true)
      ),
    /**
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        
    }
}