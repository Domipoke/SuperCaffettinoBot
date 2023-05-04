var { SlashCommandBuilder, Interaction, ChannelType, EmbedBuilder, Events} = require('discord.js');
var { getVoiceConnection,joinVoiceChannel,createAudioPlayer } = require('@discordjs/voice');

// var { tsCommandFile } = require('../class/commands');

module.exports= {
	data: new SlashCommandBuilder()
		.setName('ows')
		.setDescription('Play OneWordStories'),
	 /**
     * @param {import("discord.js").ChatInputCommandInteraction<import("discord.js").CacheType>} interaction 
     */
	async execute(interaction) {
        if (interaction) {
            var ch = interaction.channel
            var emb = new EmbedBuilder()
            .setTitle("Inizia a giocare a OneWordStories")
            .setColor(0x008080)
            .setFields([
                {name: "Regole", value:"Quando è il tuo turno scrivi una sola parola per continuare la storia creata dagli altri giocatori"},
                {name: "Gioca",value:"Se vuoi giocare clicca sulla reazione qui sotto"}
            ])
            
            if (ch) {
                interaction.deferReply({

                })
                var m =await ch.send({embeds: [emb]})
                await m.react("<:hi:1073768296215748638>")
                m.client.addListener(Events.MessageReactionAdd,() =>{

                })
            }
        }
    },
    async serverexecute() {

    }
};

