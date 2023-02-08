var fs = require('node:fs');
var path = require('node:path');
var discordjs = require('discord.js');
let conf = require("./config.json");
//
var { Client, Collection, GatewayIntentBits, REST, Routes, Events} = discordjs;
var client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildVoiceStates,
	GatewayIntentBits.GuildMessages,
]});
/*
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}*/
let ccommand = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js")|| file.endsWith('.ts'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		ccommand.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
const commands = [];
// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	var command = require(`./commands/${file}`);
	//console.log(command)   //LOG COMMANDS
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
	if (!interaction.isChatInputCommand()) return;

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
	require("./server")(client,ccommand)
})
client.on("error",(e)=>{
	console.log(e)
	process.exit(1)
})


client.login(conf.Bot.Token);
