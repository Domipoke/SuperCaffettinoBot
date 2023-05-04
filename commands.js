var {
    SlashCommandBuilder,
    CacheType,
    Interaction,
    ChannelType,
    SlashCommandSubcommandBuilder
} = require("discord.js");

module.exports={
    /**
    * @param {Interaction} interaction
    * @param {{name: string, args: any}} args
    */
    async fetchCommands(interaction, args){
        let ccommand = new Collection();

        var commandsPath = path.join(__dirname, 'commands');
        var commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js")|| file.endsWith('.ts'));

        for (var file of commandFiles) {
            var filePath = path.join(commandsPath, file);
            var command = require(filePath);
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'serverexecute' in command) {
                ccommand.set(command.data.name, command);
            }
        }
        var commands = [];
        for (var file of commandFiles) {
            var command = require(`./commands/${file}`);
            console.log(command)
            commands.push(command.data.toJSON());
        }
        if (args.name){
            var command = ccommand.get(args.name)
            if (command){
                try {
                    await command.serverexecute(interaction,args);
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }
}