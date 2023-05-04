var ytdl = require("ytdl-core");
var fs = require("node:fs");
module.exports.download=async (url, type='webm',p="./temp/youtubelastvideo.webm")  => {
    await new Promise((resolve) => { // wait
        ytdl(url, {filter: "videoandaudio"})
        .pipe(fs.createWriteStream(p),{end:true})
        .on('pipe', () => {
            resolve(p); // finish
        })
    })
    return p;
}
