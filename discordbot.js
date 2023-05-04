var fs = require('node:fs');
//var fs = require("node:fs");
var path = require('node:path');
//var path = require("node:path");
var discordjs = require('discord.js');
// var { createRequire } = require('node:module');
// var { tsCommandFile } = require('./class/commands');
// var { cmds } = require('./cmds');
//var discordjs = require("discord.js");

const conf= require("./configjson.json");
const { Player } = require('discord-player');
// const __dirname = "E:\\DesktopDomenico\\bot\\SuperCaffettinoBot\\"
//const __dirname ="./"
//import { ContextMenuCommandBuilder, ApplicationCommandType, SlashCommandBuilder } from 'discord.js';
//import {tsCommandFile} from "./class/commands";
//
var { Partials,Client, Collection, GatewayIntentBits, REST, Routes, Events} = discordjs;
var client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildScheduledEvents,
		// GatewayIntentBits.AutoModerationConfiguration,
		// GatewayIntentBits.AutoModerationExecution
	],
	partials: [
		Partials.Message,
		Partials.Channel,
		Partials.Reaction,
		Partials.GuildMember,
		Partials.GuildScheduledEvent,
		Partials.ThreadMember,
		Partials.User
	],
	//allowedMentions: true,
	enableLoaderTraceLoggings: true,
});
//

let ccommand = new Collection();

var commandsPath = path.join(__dirname, 'commands');
var commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js")|| file.endsWith('.ts'));

for (var file of commandFiles) {
	var filePath = path.join(commandsPath, file);
	var command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		ccommand.set(command.data.name, command);
	}
}	
	
	// Set a new item in the Collection with the key as the command name and the value as the exported module

	
	// } else {
	// 	console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	// }
//}
/**
 * @type {import("discord.js").RESTPostAPIChatInputApplicationCommandsJSONBody[]}
 */
const commands = [];
//const commands = []
// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	
	var command = require(`./commands/${file}`);
	//console.log(command)   //LOG COMMANDS
	console.log(file);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(conf.Bot.Token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		// await rest.put(
		// 	Routes.applicationGuildCommands("858292204665569301", "855896952007557170"),
		// 	{ body: commands },
		// );
		await rest.put(
			Routes.applicationGuildCommands("858292204665569301", "1065325163794673827"),
			{ body: commands }
		)

	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
//ASTART WOrker



//END
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return

	const command = ccommand.get(interaction.commandName);
	

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		//await interaction.deferReply();
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
	
});

client.on("ready",()=>{
	client.guilds.cache.forEach(g=>{
		g.members.me.setNickname("CaffettinoBot")
	})
	require("./server")(client,ccommand)

	// process.stdin.setRawMode(true)
	// process.stdin.on("data",(k)=>{
	// 	var key = k.toString().toLowerCase()
	// 	console.log(key)
	// 	switch (key) {
	// 		case "r":
	// 			client.login(conf.Bot.Token)
	// 			break;
	// 		case "c":
	// 			process.kill(0)
	// 			break;
	// 	}
	// })
})
client.on("error",console.warn)
client.dir = __dirname
client.player = new Player(client,{
	autoRegisterExtractor:true,
	ytdlOptions:{
		requestOptions: Object.keys({
			"__Secure-1PAPISID": "BOToFBDSEwt2F5j1/Ao2o3rublrZ-IXNEO",
			"__Secure-1PSID": "VAhVpeZtmwJAR3KSfjdJWIHl-p4eeQvg2fvn3mNVBN5p-QA198rP88MWa2kk7jytqiopjQ.",
			"__Secure-1PSIDCC": "AP8dLtwyi2gxEdOPnunkmk2PYrX2_gp8NqcW4cqrxjr1Spfq-aFsORlLO3byGWivkuSPoWHfwbo",
			"__Secure-3PAPISID": "BOToFBDSEwt2F5j1/Ao2o3rublrZ-IXNEO",
			"__Secure-3PSID": "VAhVpeZtmwJAR3KSfjdJWIHl-p4eeQvg2fvn3mNVBN5p-QA1KBIhJL9OL_qe7wfdGxIrNA.",
			"__Secure-3PSIDCC": "AP8dLtzZefueV40br9W9ztjkriYKqsbzZsIbrEp-6zvLfHhk62mmMw5PJYEgKVf30BHn07jKTw",
			"_gcl_au": "1.1.2120670115.1680042936",
			"APISID": "RvKnoXC99SRg8W-f/AgqNikzs1kjoHtlwp",
			"CONSENT": "PENDING+655",
			"DEVICE_INFO": "ChxOekU1TXpjek16TTBNRGMyTVRrNU1qRTJOUT09ENyM1Z4GGNyM1Z4G",
			"HSID": "AQTGxDvG-405SgbOq",
			"LOGIN_INFO": "AFmmF2swRgIhAOY5YmBaVbJGxXqtkEatrF1o6YhdT9zfi7EIvL49Sj-HAiEAweRi2btErDfveFz7g1QEKY98VI9-A3T_erp138yKwv0:QUQ3MjNmd1g1bElqczNfOHZWN1dVWTUxcnNoVGFLNl9YTDRiYVY1cXJUaG9aSDdUd1dUUU50UElucUZIMEVZWG5uZy1jR2s3RXBlM3d4dXMzYVhRekY0RDhqTnVoSDZkSk8tQzlVSGhibEVrdTh0N1FCUV9IdzZ4NVltN01CUV9KYW15dEVIUlpkckUzN0hCNlN0LWdWOXZzQkJ3QzREcGV3",
			"PREF": "tz=Europe.Rome&f6=40000000&f7=100&volume=16",
			"SAPISID": "BOToFBDSEwt2F5j1/Ao2o3rublrZ-IXNEO",
			"SID": "VAhVpeZtmwJAR3KSfjdJWIHl-p4eeQvg2fvn3mNVBN5p-QA1-gBAg6RkeobsXYNqIBpgHA.",
			"SIDCC": "AP8dLtw4nqLvjMmQv1cyimsWd_R_tRvNJC85z1S8dbeJJunVk0FZiSRsZbLE1actavQbHq3Vkg",
			"SOCS": "CAISEwgDEgk1MDQ5MTI2NTYaAml0IAEaBgiAy9GeBg",
			"SSID": "AEC4cGAW7XMojbEiw",
			"VISITOR_INFO1_LIVE": "nOhkWTolA_w",
			"wide": "1",
			"YSC": "UxEq4bRedTY",
			"expires": "Sat, 13-Apr-2024 17:37:44 GMT",
			"path": "/",
			"domain": ".youtube.com",
			"priority": "high",
			"SameSite": "none"
		}).map((k,i,cookies)=>k+"="+cookies[k]+"; ").join("")
	},
})

client.login(conf.Bot.Token);
