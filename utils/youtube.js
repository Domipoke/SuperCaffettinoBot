var ytdl = require("ytdl-core")
module.exports = {
    download: (url)=> {
        ytdl(url).pipe(fs.createWriteStream('./temp/youtubelastvideo.mp4'));
    }
}