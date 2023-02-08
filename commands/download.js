var { SlashCommandBuilder} = require('discord.js');



module.exports = {
	data: new SlashCommandBuilder()
		.setName('download')
		.setDescription('Download something on bot memory'),
	async execute(interaction) {
		
	},
	/**
	 * 
	 * @param {import("discord.js").Client} client 
	 * @param {{name: string,args: JSON}} cmd 
	 */
	async serverexecute(client,cmd) {

	}
};