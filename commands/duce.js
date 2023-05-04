var  { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } = require("node-html-markdown")
var { SlashCommandBuilder, Interaction, ChannelType, MessagePayload, EmbedBuilder } =require("discord.js");
var timestamp = require('unix-timestamp');
var { DuceONonDuce, DuceEnum } = require("../class/openai");
var {createConnection} = require("mysql");
var htm = new NodeHtmlMarkdown(
  {}
)
var reactions = {
  hi:{em: "<:hi:1073768296215748638>",duce:true, id:"1073768296215748638"},
  pd:{em: "<:pd:1073947778671202375>",duce:false, id:"1073947778671202375"}
}
var subs = {
  quiz: "quiz"
}
var bansname = ["Camillo Tortora", "Laura Tortora","Roberto Ercole"]
module.exports = {
    data: new SlashCommandBuilder()
      .setName("duce")
      .setDescription("Duce o non Duce?")
      .addStringOption((o) =>
        o.setName("chi").setDescription("Puoi anche usare: -all").setRequired(false)
      )
      .addIntegerOption((o)=>
        o.setName("countdown").setDescription("Tempo").setRequired(false)
      ),
    /**
     * @param {import("discord.js").ChatInputCommandInteraction<import("discord.js").CacheType>} interaction 
     */
    async execute(interaction) {
      if (interaction) {
        var con = createConnection({
          host: "localhost",
          port:3306,
          user: "root",
          password:"SuperCaffettinoBot",
          database: "bot"
        })
        var durtime=interaction.options.getInteger("countdown")??30
        // var sub = null
        // if (sub==subs.quiz) {

        // } else {  
        if (true) {
          console.log(interaction.deferred)
          if (!interaction.deferred) interaction.deferReply()
          con.connect((err,args)=>{
            if (err) console.log(err)
            //if (args) console.log("SQL:Start ",args)
            //console.log("**Remember to start DUC and SQL-Service: SuperCaffettinoBot")
          })
          var who =interaction.options.getString("chi")??""
          console.log(who+1)
          con.query("SELECT * FROM duceononduce",async(err,res,fields)=>{
            //console.log(err,res,fields)
            console.log(0)
            if (err) console.log(err);
            var ele = null;
            if (who!=""){
              var ee = Array.from(res).find((x)=>x.name==who)
              if (ee){

              }
            } else {
              console.log(1)
              var rand = (a)=>{
                var arr=a.sort((a,b)=>{
                  var r= Math.round(Math.random())
                  if (r==0) {
                    return -1
                  } else {
                    return 1
                  }
                })
                var iii = Math.floor(Math.random()*arr.length)
                var ce = arr[iii]
                if (!bansname.includes(ce.name)) {return ce}
                else {return rand(a)}
              }
              ele =rand(Array.from(res))
            }
            console.log(3)
            if (ele) {
              console.log(2)
              var e = emb(ele.name,ele.lore,ele.image)
              console.log(e);
              // fetchReply: true
              var m = await interaction.channel.send({embeds: [e] })
              // console.log(interaction.guild.emojis.cache)
              //try{
                await m.react(reactions.hi.em)
                await m.react(reactions.pd.em)
              //} catch(e){console.log(e)}
              var rep = "<t:"+(Math.floor(timestamp.now(0)+durtime))+":R>"
              if (interaction.deferred) {interaction.editReply(rep)} else {interaction.reply(rep)}
              setTimeout(async ()=>{
                if (interaction.deferred) {interaction.editReply("End")} else {interaction.reply("End")}
                var duce = 0
                var nonduce = 0
                var tpro = []
                var tcontro =[]
                m.reactions.cache.forEach(async x=>{
                  if (x.emoji.name) {
                    var r = reactions[x.emoji.name]
                    if (r) {
                      if (r.duce==true){
                        duce+=x.count
                        var arr = await x.users.fetch()
                        arr.forEach((e)=>{                           
                          if (!tpro.includes(e.username)&&e.username!="CaffettinoBot") {tpro.push(e.username);console.log(tpro)}
                        })
                      } else {
                        nonduce+=x.count
                        var arr = await x.users.fetch()
                        arr.forEach((e)=>{
                          if (!tcontro.includes(e.username)&&e.username!="CaffettinoBot") {tcontro.push(e.username);console.log(tcontro)}
                        })
                      }
                    }
                  }
                  
                })
                var pro = tpro
                var contro = tcontro
                duce-=1
                nonduce-=1
                var oai=new DuceONonDuce()
                var resp=""
                if (duce>nonduce) {
                  await interaction.channel.send({
                    content: "Il popolo ha scelto come nuovo Duce "+ele.name
                  })
                  resp=await oai.description(DuceEnum.duce,pro,contro,ele)
                  //con.query("")
                } else if (duce<nonduce) {
                  await interaction.channel.send({
                    content: "Il popolo ha scelto come plebeo "+ele.name
                  })
                  resp=await oai.description(DuceEnum.nonduce,pro,contro,ele)
                  //con.query("")
                } else {
                  await interaction.channel.send({
                    content: "Il popolo non è in grado di decidere. "+ele.name+ " provedderà con un Colpo di Stato."
                  })
                  resp=await oai.description(DuceEnum.nullo,pro,contro,ele)
                }
                await interaction.channel.send({
                  content: resp
                })
              },durtime*1000)
              con.destroy()
              
            }
          }) 
        // }
        }
      }
        //return;
    }
}

function emb(name,lore,img) {
  // console.log(img)
  console.log(name,lore,img)
  var e = new EmbedBuilder()
  .setColor(0xAA0000)
  .setTitle("Duce o non Duce?")
  //.setURL("http://caffettino.ydns.eu:4/games/duceononduce")
  if (name) {e.setDescription(name)}
  if (lore) {e.addFields(
    {name: "Lore:",value:HtmlToMk(lore)}
  )}
  if (img) {e.setImage(img)}//CHECK IF WORKS. If not try to upload using not listed imgur
  return e
}

function HtmlToMk(t) {
  return htm.translate(t)
}

