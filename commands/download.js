var { SlashCommandBuilder}= require('discord.js');
// var {tsCommandFile} = require("../class/commands");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('download')
		.setDescription('Download something on bot memory'),
	/**
	 * @param {import("discord.js").ChatInputCommandInteraction<import("discord.js").CacheType>} interaction 
	 */
	async execute(interaction) {
		
	},
	
	async serverexecute(client,cmd) {

	}
};
