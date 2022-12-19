var ytdl = require("ytdl-core")
var fs = require("node:fs");
const { getInfo } = require("ytdl-core");
module.exports = {
    download: async (url, type='webm',p="./temp/youtubelastvideo.webm")=> {
        await new Promise((resolve) => { // wait
            ytdl(url, {filter: "videoandaudio"})
            .pipe(fs.createWriteStream(p),{end:true})
            .on('pipe', () => {
              resolve(); // finish
            })
        })
        return p;
    },
    getRS: (url,type='webm') => {
        return ytdl(url,{format: (f)=>{f.container===type},filter: 'audioandvideo'})
    },
}
