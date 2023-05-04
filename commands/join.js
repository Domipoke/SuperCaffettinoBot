var { SlashCommandBuilder, Interaction, ChannelType } = require('discord.js');
var { getVoiceConnection,joinVoiceChannel,createAudioPlayer } = require('@discordjs/voice');

// var { tsCommandFile } = require('../class/commands');

module.exports= {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join voice channel'),
	
	async execute(interaction) {
        if (interaction) {
            var ch = interaction.channel
            if (ch) {
                var type = ch.type
                if (type==ChannelType.GuildVoice) {
                    var cid = ch.id;
                    var gid = interaction.guildId;
                    var igaC = interaction.guild?.voiceAdapterCreator;
                    if (cid&&gid&&igaC) {
                        const con = joinVoiceChannel({
                            channelId: cid,
                            guildId: gid,
                            adapterCreator: igaC
                        })
                        await interaction.reply("Connected!")
                    }
                }
            }
        }
    },
    async serverexecute() {

    }
};

