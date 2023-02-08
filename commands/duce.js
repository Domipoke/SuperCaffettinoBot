
var { SlashCommandBuilder, Interaction, ChannelType } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
      .setName("duce")
      .setDescription("Duce o non Duce?")
      .addStringOption((o) =>
        o.setName("chi").setDescription("Usa _ al posto dello spazio").setRequired(false)
      ),
    /**
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        if (interaction) {}
    }
}