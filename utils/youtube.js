var ytdl = require("ytdl-core")
var fs = require("node:fs")
module.exports = {
    download: (url, type='webm')=> {
        var p = "./temp/youtubelastvideo.webm";
        ytdl(url, {filter: "videoandaudio"}).pipe(fs.createWriteStream(p))
        return p;
    },
    getRS: (url,type='webm') => {
        return ytdl(url,{format: (f)=>{f.container===type},filter: 'audioandvideo'})
    }
}
