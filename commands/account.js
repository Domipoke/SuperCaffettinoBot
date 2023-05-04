
const { getVoiceConnection } = require("@discordjs/voice");
var { SlashCommandBuilder, Interaction, ChannelType } = require("discord.js");
// import { tsCommandFile } from "../class/commands";
var subs = {
    getCode: "get_code",
    newCode: "new_code"
}
var sql = {
    getUser: (a)=>'SELECT 1 FROM user WHERE username = "'+a+'";',
    setCode: (u,c)=>'UPDATE user SET code = "'+c+'" WHERE username = "'+u+'";',
    getCode: (u)=>'SELECT code FROM user WHERE username = "'+u+'";',
    addUser: (u,c)=>'INSERT INTO user (username, code) VALUES ("'+u+'", "'+c+'");'
}
module.exports = {
    data: new SlashCommandBuilder()
      .setName("account")
      .setDescription("Manage your account")
      .addSubcommand(x=>{
        return x.setName(subs.getCode).setDescription("Get your code")
      })
      .addSubcommand(x=>{
        return x.setName(subs.newCode).setDescription("Get your code")
      }),
    /**
     * @param {import("discord.js").ChatInputCommandInteraction<import("discord.js").CacheType>} interaction 
     */
    async execute(interaction) {
        var con = require("mysql").createConnection({
            host: "localhost",
            port: 3306,
            user: "root",
            password:"SuperCaffettinoBot",
            database: "bot"
        })
        var sc = interaction.options.getSubcommand();
        switch (sc) {
            case subs.getCode:
                var us = interaction.user.username+"#"+interaction.user.discriminator
                con.query(sql.getCode(us),(err,result,fields)=>{
                    console.log("SQL:GetCode: ",err,result,fields)
                    var cd = "usa il comando `/account newCode` per ottenere un nuovo codice"
                    if (err) console.log(err);
                    if (result) {
                        if (result[0]) {
                            cd=result[0]["code"] 
                        }
                    }
                    
                    if (interaction.member.roles.cache.has("1068202311027003472")) {
                        interaction.member.send("Il tuo codice è:`"+cd+"`")
                        interaction.reply({content: "Code sent",ephemeral: true})
                    } else [
                        interaction.reply({content: "No permission",ephemeral: true})
                    ]
                    
                })
                
                break;
            case subs.newCode:
                var us = interaction.user.username + "#"+interaction.user.discriminator
                con.query(sql.getUser(us),(err, result, fields)=>{
                    if (err) {console.log("SQL:SearchUserdb",err)}
                    console.log(err,result,fields)
                    var cd =Math.floor(100000 + Math.random() * 900000).toString();
                    if (result) {
                        // Log in
                        // con update code
                        con.query(sql.setCode(us,cd),(berr,bresult,bfiels)=>{
                            console.log("SQL:setCode",berr,bresult,bfiels)
                        })
                    } else {
                        // Register
                        // con add user
                        con.query(sql.addUser(us,cd),(berr,bresult,bfiels)=>{
                            console.log("SQL:addUSER",berr,bresult,bfiels)
                        })
                    }
                    if (interaction.member.roles.cache.has("1068202311027003472")) {
                        interaction.member.send("Il tuo codice è:`"+cd+"`")
                        interaction.reply({content: "Code sent",ephemeral: true})
                    } else [
                        interaction.reply({content: "No permission",ephemeral: true})
                    ]
                })
                break;
        }
        con.end()
    }
}
