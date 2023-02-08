var {
    getVoiceConnection,
    StreamType,
    joinVoiceChannel,
    createAudioPlayer,
    NoSubscriberBehavior,
    createAudioResource,
    AudioPlayer,
    AudioPlayerStatus,
    VoiceConnection,
  } = require("@discordjs/voice");
  var {ChatInputCommandInteraction} = require("discord.js")
var { existsSync, fstat, writeFileSync, readFileSync, readdirSync, unlink, createWriteStream } = require("node:fs")
var {join} = require("node:path")
var yt = require("../utils/youtube")
var {createReadStream} = require("node:fs")
var Keyv = require("keyv");
const { download } = require("../utils/youtube");
const ytdl = require("ytdl-core");

class TimeText {
    startat;
    text;
    /**
     * @param {number} start 
     * @param {string} text 
     */
    constructor (start, text) {
        this.startat=start
        this.text=text
    }
}
class Lyrics {
    name;
    url;
    endat;
    startat;
    /**
     * @type {TimeText[]} 
     */
    text;
    /**
     * 
     * @param {string} name 
     * @param {string} url 
     * @param {number} start 
     * @param {number} end 
     */
    constructor (name, url, start, end) {
        this.name=name
        this.url=url
        this.startat=start
        this.endat=end
        this.text=[]
    }
    /**
     * 
     * @param {TimeText} t 
     */
    addText(t) {
        this.text.push(t)
        this.orderText()
    }
    /**
     * 
     * @param {string} l 
     */
    addTextFromLyrics(l) {
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
    }/**
     * 
     * @param {AudioResource} r 
     * @returns {TimeText}
     */
    getText(r) {
        var c=r.playbackDuration
        return this.text.filter(s=>s.startat<c).sort((a,b)=>b.startat-a.startat)[0]
    }
}
class Track {
    /**
     * @property {string} url
     * @property {string} name
     * @property {string} fp
     * @property {Lyrics[]} lyrics
     */
    
    /**
     * 
     * @param {string} url 
     * @param {string} fp 
     */
    constructor (url, fp=null) {
        this.url = this.check(url);
        this.name = (new URL(this.url)).searchParams.get("v")??""
        this.fp = fp??join(__dirname,"../videos/files",this.name+".webm")
        this.lyrics = []
    }
    async download(forced=false) {
        if (!this.isDownloaded()||forced) await yt.download(this.url,"webm",this.fp)
    }
    isDownloaded() {
        return existsSync(this.fp)
    }
    toJson() {
        return {
            url: this.url,
            fp: this.fp,
            lyrics: this.lyrics
        }
    }
    /**
     * 
     * @param {string} url 
     * @returns 
     */
    check(url) {
        var u = url;
        if (url.startsWith("https://youtu.be/")) {
            u = "https://www.youtube.com/watch?v="+url.substring("https://youtu.be/".length)
        } else if (url.startsWith("http://youtu.be/")) {
            u = "https://www.youtube.com/watch?v="+url.substring("http://youtu.be/".length)
        }
        return u;
    }
    /**
     * 
     * @param {AudioResource} r 
     * @returns {TimeText}
     */
    getText(r) {
        var c=r.playbackDuration
        return this.lyrics.filter(s=>s.startat<c).sort((a,b)=>b.startat-a.startat)[0].getText(r)
    }
    async play(interaction,con, ap) {
        var currentsong = this
        await new Promise((resolve)=>ytdl(currentsong.url, {filter: "audioonly"}).pipe(createWriteStream("temp/video.webm")).on("close",()=>resolve()))
        var r = createAudioResource(createReadStream("temp/video.webm"));
        r.volume?.setVolume(0.5);
        ap.play(r);
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
        var sub = con.subscribe(ap);
    }


    static fromJSON(json) {
        var t= new Track(json.url,json.fp)
        t.lyrics = json.lyrics
        return t
    }
}
class Playlist {
    
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
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {VoiceConnection} con
     * @param {AudioPlayer} ap
     */
    async play(interaction,con, ap,cs) {
        var ts = this.tracks;
        this.currentstep = cs;
        console.log(ts.length)
        console.log(this.currentstep)
        if (ts.length>this.currentstep) {
            /**
             * @type {Track}
             */
            var currentsong = ts[this.currentstep]
            await new Promise((resolve)=>ytdl(currentsong.url, {filter: "audioonly"}).pipe(createWriteStream("temp/video.webm")).on("close",()=>resolve()))
            var r = createAudioResource(createReadStream("temp/video.webm"));
            r.volume?.setVolume(0.5);
            ap.play(r);
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
                    await new Promise((resolve)=>ytdl(ncurrentsong.url, {filter: "audioonly"}).pipe(createWriteStream("temp/video.webm")).on("close",()=>resolve()))
                    var res = createAudioResource(createReadStream("temp/video.webm"));
                    res.volume?.setVolume(0.5);
                    ap.play(res);
                    var it = "Playing: " +
                    ncurrentsong.name +
                    " Volume: " +
                    (res.volume?.volume ?? "default")
                    if (interaction) await interaction.editReply(it)
                }
            })
            con.on("skip",async () =>{
                console.log(this.currentstep)
                this.currentstep+=1
                if (ts.length>this.currentstep) {
                    var ncurrentsong = ts[this.currentstep]
                    //UPDATE //ytdl(currentsong.url, {filter: "audioonly"})
                    await new Promise((resolve)=>ytdl(ncurrentsong.url, {filter: "audioonly"}).pipe(createWriteStream("temp/video.webm")).on("close",()=>resolve()))
                    var res = createAudioResource(createReadStream("temp/video.webm"));
                    res.volume?.setVolume(0.5);
                    ap.play(res);
                    var it = "Playing: " +
                    ncurrentsong.name +
                    " Volume: " +
                    (res.volume?.volume ?? "default")
                    if (interaction) await interaction.editReply(it)
                }
            })
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
module.exports = {
    TimeText,
    Lyrics,
    Track,
    Playlist,
    unlinkall: ()=> {
        var p =join(__dirname,"../videos/files")
        var files=readdirSync(p)
        files.forEach(f=>{
            var pp=join(p,f)
            console.log(pp)
            unlink(pp,(err)=>{if (err) throw err;})
        })
    }
}