var { SlashCommandBuilder, Interaction, ChannelType } = require('discord.js');
var { getVoiceConnection,joinVoiceChannel,createAudioPlayer,  } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join voice channel'),
	/**
     * 
     * @param {Interaction} interaction 
     */
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
    /**
	 * 
	 * @param {import("discord.js").Client} client 
	 * @param {{name: string,args: JSON}} cmd 
	 */
	async serverexecute(client,cmd) {

	}
};