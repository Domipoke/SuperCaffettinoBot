var {
    createAudioResource,
    AudioPlayerStatus,
    AudioPlayerState,
    entersState,
    VoiceConnectionStatus,
    AudioResource,
    demuxProbe,
    getVoiceConnection
  } = require("@discordjs/voice");
//var HttpsProxyAgent = require('https-proxy-agent');

var { existsSync, writeFileSync, readFileSync, readdirSync, unlink, createReadStream, createWriteStream } = require("node:fs");
var {join} = require("node:path");
var yt = require("../utils/youtube");

// var ytdl = require("ytdl-core");
//var playdl = require("play-dl");
const ytdl = require("ytdl-core");
const dytdl = require("@distube/ytdl-core");
const mds = require("discord-player");


// const ffmpeg = require("ffmpeg");
// const { OpusEncoder } = require("@discordjs/opus");
class TimeText {
    // startat//:number;
    // text//:string;
    constructor (start,text){//:number, text//:string) {
        this.startat=start
        this.text=text
    }
    
    to_ms(timestamp){//:string)//:number {
        var m = [1000,60000,3600000,864000000]
        var t = timestamp.split(/[:]/).reverse()
        if (t.length>4) {console.log(t); return 0}
        var ms = 0
        t.forEach((x,i)=>ms+=Number.parseFloat(x)*m[i])
        return ms
    }
}
// interface LyricsInfo {
//     text//: {
//         timestamp//: string
//         text//: string
//     }[]
//     name//: string
//     author//: string
//     from//: string
// }
// interface JsonTimeStamp {
//     title//: string
//     url//: string
//     youtube//: {id//: string}
//     timestamps//:Object
// }
class Lyrics {
    name////:string;
    url////:string;
    endat////:number;
    startat////:number;
    info//:LyricsInfo;
    
    text//:TimeText[];
    
    constructor (name,start,end,inf){//:string, start//:string, end//:string, inf//:LyricsInfo) {
        this.name=name
        this.startat=this.to_ms(start)
        this.endat=this.to_ms(end)
        this.info = inf
        this.setText()
    }
    setText() {
        this.text=[]
        this.info.text.forEach(x=>{
            console.log(x)
            if (x.timestamp) {
                this.text.push(
                    new TimeText(this.to_ms(x.timestamp)+this.startat,x.text)
                )
            }
        })
    }
    
    to_ms(timestamp){//:string)//:number {
        var m = [1000,60000,3600000,864000000]
        var t = timestamp.split(/[:]/).reverse()
        if (t.length>4) {console.log(t); return 0}
        var ms = 0
        t.forEach((x,i)=>ms+=Number.parseFloat(x)*m[i])
        return ms
    }
    
    checkfromTimestamp(timestamp){//:string) {
        var ms = this.to_ms(timestamp)
        console.log(timestamp," => ",ms)
        if (this.startat<=ms&&ms<this.endat) {
            return {
                now: true,
                data: this.info 
            }
        } 
        return null
    }
   
    addText(t){//:TimeText) {
        this.text.push(t)
        this.orderText()
    }

    addTextFromLyrics(l){//:string) {
        l.split("\n").forEach(line=>{
            var s = line.indexOf("[")
            var e = line.indexOf("]")
            var timesub = line.substring(s+1,e-1)
            var seconds = 0
            seconds += Number.parseInt(timesub.split(":")[0])*60 //minute
            seconds += Number.parseInt(timesub.split(":")[1].split(".")[0]) //seconds
            seconds += Number.parseInt(timesub.split(":")[1].split(".")[1])*0.01 //cents
            this.text.push(new TimeText(seconds,line.substring(e+1)))
        })
        this.orderText()
    }
    orderText() {
        this.text.sort((x,y)=>x.startat-y.startat)
    }

    getText(r){//:import("@discordjs/voice").AudioResource)//:TimeText {
        var c=r.playbackDuration
        return this.text.filter(s=>s.startat<c).sort((a,b)=>b.startat-a.startat)[0]
    }
}
class Track {
    
    url//:string
    name//:string
    fp//:string
    lyrics//:Lyrics[]
    timeouts//:any[]
    id//:string
    
    constructor (url,fp) {//:string, fp//:string|null) {
        this.url = this.check(url);
        this.timeouts=[]
        this.id = this.url.substring("https://www.youtube.com/watch?v=".length)
        this.name = (new URL(this.url)).searchParams.get("v")??""
        this.fp = fp??join(__dirname,"../videos/files",this.name+".webm")
        this.checkforTimestamp()
    }
    checkforTimestamp(){
        var p = join(__dirname,"../videos/lyrics/")
        var files = readdirSync(p)
        
        var json=null//:JsonTimeStamp|null = null
        console.log(files, this.id)
        for (var f in files) {
            var file = files[f]
            if (file.startsWith(this.id)) {
                console.log("found", join(p,file))
                json=require(join(p,file))
            }
        }
        if (json!=null) {
            this.lyrics = Object.keys(json.timestamps).map(x=>{
                console.log(x)
                return new Lyrics(
                    x,
                    json.timestamps[x].timestamp.start,
                    json.timestamps[x].timestamp.end,
                    json.timestamps[x]
                )
            })
        }
    }
    
    async download(forced=false) {
        if (!this.isDownloaded()||forced) await yt.download(this.url,"webm",this.fp)
    }
    isDownloaded() {
        return existsSync(this.fp)
    }
    toJson() {
        return {
            url,//: this.url,
            fp,//: this.fp,
            lyrics//: this.lyrics
        }
    }
    
    check(url){//:string)//:string {
        var u = url;
        if (url.startsWith("https://youtu.be/")) {
            u = "https://www.youtube.com/watch?v="+url.substring("https://youtu.be/".length)
        } else if (url.startsWith("http://youtu.be/")) {
            u = "https://www.youtube.com/watch?v="+url.substring("http://youtu.be/".length)
        } else if (url.startsWith("https://youtu.be/")) {
            u = "https://www.youtube.com/watch?v="+url.substring("https://youtu.be/".length)
        }
        return u;
    }
    
    getText(r){//:import("@discordjs/voice").AudioResource)//:TimeText {
        var c=r.playbackDuration
        return this.lyrics.filter(s=>s.startat<c).sort((a,b)=>b.startat-a.startat)[0].getText(r)
    }
    async getResources() {
        
        var ytdlj = {
            quality: "highestaudio",
            filter: "audioonly",
            highWaterMark: 1024*1024*500,
            dlChunkSize: 1024*1024,
            requestOptions: {
                headers: {
                    cookie: cok()
                }
            }
        }
        var s = dytdl(this.url, ytdlj)
        // var ev = ['abort', 'request', 'response', 'error', 'redirect', 'retry', 'reconnect']
        // ev.forEach((k)=>s.on(k,(q)=>console.log(k,q)))
        s.on("info", info => {
            console.log('title:', info.videoDetails.title);
            console.log('uploaded by:', info.videoDetails.author.name);
        })
        s.on('progress', (chunkLength, downloaded, total) => {
            const percent = downloaded / total;
            //console.log('downloading', `${(percent * 100).toFixed(1)}%`);
            if (percent==1) {
                console.log("MB: "+total/(1024*1024));
            }
        });
        
        var r = createAudioResource(s, {
             
            autoClose: false,           
            
            
            silencePaddingFrames: 0,
            
            metadata: {
                title: this.url
            }
        });

        r.playStream.on("error",console.warn)
        return r
        
    }
    async getRes() {
        return new Promise(async (resolve, reject) => {
            
			const process = ytdle(
				this.url,
				{
					o: '-',
					q: '',
					f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
					r: '100K',
				},
				{ stdio: ['ignore', 'pipe', 'ignore'] },
			);
			
			const stream = process.stdout;
			const onError = (error) => {
				if (!process.killed) process.kill();
				stream.resume();
				reject(error);
			};
			process
				.once('spawn', () => {
					demuxProbe(stream)
						.then((probe) => resolve(createAudioResource(probe.stream, { metadata: this, inputType: probe.type })))
						.catch(onError);
				})
				.catch(onError);
		});
    }
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction<import("discord.js").CacheType>} interaction 
     * @param {import("@discordjs/voice").VoiceConnection} con 
     * @param {import("@discordjs/voice").AudioPlayer} ap 
     
    async play(interaction,con, ap,) {
        console.log("play")
        this.player(interaction.client,interaction)
        return
        try{
            var currentsong = this
            
            var r = await currentsong.getResources()
            ap.on(AudioPlayerStatus.AutoPaused,
                /**
                 * 
                 * @param {AudioPlayerState} old 
                 * @param {AudioPlayerState} ne 
                 
                (old,ne) =>{
                    console.log(old,ne);
                }
            )
            ap.on("debug", (...e)=>console.log("debug", e))
            
            ap.on("error", console.warn);
            
            
            // //await entersState(con, VoiceConnectionStatus.Ready, 5000);
            
            
            r.volume?.setVolume(0.5);
            
            ap.play(r);
            
            
            return con.subscribe(ap);
        } catch (err){console.log(err);}
    }*/
/**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction<import("discord.js").CacheType>} interaction 
    */
    async player(interaction) {
        /**
         * @type {mds.Player}
         */
        var p = interaction.client.player
        p.events.on("debug",(q,m)=>console.log(m))
        p.events.on("playerStart",async (q,tr)=>{
            console.log("The audio player has started playing!");
            var t= "Playing: "+tr.title;
            if (interaction.replied) await interaction.editReply(t)
            //console.log(tr);
           /* if (interaction!=null) {
                
                var mp = await interaction.channel.send("Lyrics")
                var ml = await interaction.channel.send("Loading..")
                this.followUp(interaction,mp,ml)
                this.getText
            }*/
        })
        p.events.on("error",(q,err)=>console.log(err))
        p.events.on("playerError",(err,tr)=>console.log(err))
        p.events.on("playerFinish",()=>console.log("finish"))
        //p.events.on("audioTrackAdd",(q,t)=>console.log(q.tracks.map(x=>x.title)))
        //
        var pl = await p.play(interaction.guild.members.me.voice.channel.id,this.url,{
            nodeOptions: {
                leaveOnEmpty: false,
                leaveOnEmptyCooldown: false,
                leaveOnEnd: false,
                leaveOnEndCooldown: false,
                leaveOnStop: false,
                leaveOnStopCooldown: false,
                
                metadata: {

                    title: this.url
                },
                
            },
            
            
        })
        
        // var n = (Date.now()/1000).toFixed(0)
        // if (interaction.deferred || interaction.replied) {
        //     interaction.followUp("<t:"+n+":R>")
        // } else {
        //     interaction.reply("<t:"+n+":R>")
        // }
        /*pl.on("",async (queue, old ,ne)=> {
            if (old.status==ne.status) return;
            
        })*/
        
    }
    /**
     * 
     * @param {*} interaction 
     * @param {import("@discordjs/voice").VoiceConnection} con 
     *
    async playConnection(interaction, con) {
        con.playOpusPacket(ytdl(this.url,{
            quality:"highestaudio",filter:"audioonly"
        }))
    }*/

    async followUp(
        interaction,//: import("discord.js").ChatInputCommandInteraction<import("discord.js").CacheType>,
        mpres,//:import("discord.js").Message<false> | import("discord.js").Message<true>,
        mlyr){//:import("discord.js").Message<false> | import("discord.js").Message<true>) {
        
        this.lyrics?.forEach(x=>{

            this.timeouts.push(setTimeout(async()=>{
                var i = x.info
                if (i) {
                    if (mpres) {
                        await mpres.edit(i.name+" - "+i.author+" ["+i.from+"]")
                    }
                }
                var bot = interaction.guild.members.me
                if (bot) {
                    if (i) {
                        var n = ""
                        if (i.name.length<=16) {n=i.name} else {n=i.name.substring(0,13)+"..."}
                        bot.setNickname(n+" - CaffettinoBot")
                    }
                    else bot.setNickname("CaffettinoBot")
                } else {
                    console.log("Not found")
                }
            },x.startat))
            if (x.text){
                x.text.forEach(y=>{
                    this.timeouts.push(setTimeout(async()=>{
                        await mlyr.edit(y.text)
                    },y.startat))
                })
            } else {
                
            }
        })
    }

    static fromJSON(json) {
        var t= new Track(json.url,json.fp)
        t.lyrics = json.lyrics
        return t
    }
}
class Playlist {
    // name//:string
    // tracks//: any[]
    // currentstep//: number
    
    constructor(name) {
        this.name=name
        this.tracks = []
    }
    getFilePath() {
        var {join} = require("path")
        var dir = join(__dirname,"../videos/playlist")
        var f = join(dir, this.name+".json")
        return {exists: existsSync(f), fp: f}
    }
    async checkTracks() {
        
        this.tracks.forEach(
            /**
             * 
             * @param {Track} t 
             */
            async (t)=>{
                
                await t.download(true)
            }
        )
    }
    saveFile() {
        var r = this.getFilePath()
        var c = JSON.stringify({
            name: this.name,
            tracks: this.tracks.filter(x=>(x instanceof Track)).map(x=>x.toJson())
        })
        console.log(c)
        writeFileSync(r.fp,c)
    }
    
    async play(
        interaction,//:import("discord.js").ChatInputCommandInteraction<import("discord.js").CacheType>,
        con,//:VoiceConnection, 
        ap,//:AudioPlayer,
        cs//:number
    ) {
        var ts = this.tracks;
        this.currentstep = cs;
        console.log(ts.length)
        console.log(this.currentstep)
        if (ts.length>this.currentstep) {
            /**
             * @type {Track}
             */
            var currentsong = ts[this.currentstep]
            await currentsong.promise()
            var r = await currentsong.getResources()
            r.volume?.setVolume(0.5);
            
            ap.on("error", (error) => {
                console.error(error);
            });
            ap.on(AudioPlayerStatus.Playing, async (old,ne) =>{
                if (old.status==ne.status) return;
                console.log("The audio player has started playing!");
                console.log(r.started);
                var t= "Playing: "+currentsong.name+" Volume: "+(r.volume?.volume ?? "default")
                if (interaction) await interaction.editReply(t)
            });
            
            ap.on(AudioPlayerStatus.Idle, async (old,ne) =>{
                if (old.status==ne.status) return;
                console.log(this.currentstep)
                this.currentstep+=1
                if (ts.length>this.currentstep) {
                    var ncurrentsong = ts[this.currentstep]
                    //UPDATE //ytdl(currentsong.url, {filter: "audioonly"})
                    // await new Promise((resolve)=>ytdl(ncurrentsong.url, {filter: "audioonly"}).pipe(createWriteStream("temp/video.webm")).on("close",()=>resolve(true)))
                    // var res = createAudioResource(createReadStream("temp/video.webm"));
                    var res = ncurrentsong.getResources()
                    res.volume?.setVolume(0.5);
                    ap.play(res);
                    var it = "Playing: " +
                    ncurrentsong.name +
                    " Volume: " +
                    (res.volume?.volume ?? "default")
                    if (interaction) await interaction.editReply(it)
                }
            })
            
            con.addListener("skip",async () =>{
                console.log(this.currentstep)
                this.currentstep+=1
                if (ts.length>this.currentstep) {
                    var ncurrentsong = ts[this.currentstep]
                    //UPDATE //ytdl(currentsong.url, {filter//: "audioonly"})
                    //await new Promise((resolve)=>ytdl(ncurrentsong.url, {filter: "audioonly"}).pipe(createWriteStream("temp/video.webm")).on("close",()=>resolve(true)))
                    //var res = createAudioResource(createReadStream("temp/video.webm"));
                    var res = ncurrentsong.getResources()
                    res.volume?.setVolume(0.5);
                    ap.play(res);
                    var it = "Playing: " +
                    ncurrentsong.name +
                    " Volume: " +
                    (res.volume?.volume ?? "default")
                    if (interaction) await interaction.editReply(it)
                }
            })
            //await entersState(con, VoiceConnectionStatus.Ready, 5000);
            ap.play(r);
            var sub = con.subscribe(ap);
        }
    }
    static fromJSON(json) {
        var p = new Playlist(json.name)
        p.name = json.name;
        p.tracks = Array.from(json.tracks).map(t=>Track.fromJSON(t));
        return p
    }
    static fromName(name){
        return Playlist.fromJSON(JSON.parse(readFileSync(join(__dirname,"../videos/playlist",name+".json")).toString()))
    }
    static fromThis(name,tracks,currentstep) {
        var p = new Playlist(name)
        p.tracks=tracks
        p.currentstep=currentstep
        return p 
    }
}
function unlinkall() {
    var p =join(__dirname,"../videos/files")
    var files=readdirSync(p)
    files.forEach(f=>{
        var pp=join(p,f)
        console.log(pp)
        unlink(pp,(err)=>{if (err) throw err;})
    })
}
module.exports ={
    TimeText,
    Lyrics,
    Track,
    Playlist
}