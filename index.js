var ytdl = require("ytdl-core")
var fs = require("node:fs")



var url = "https://www.youtube.com/watch?v=6CBp4qylX6I"
// WORK MP3

// var p = "./temp/youtubelastvideo.mp3";
// ytdl(url,{filter: 'audioonly'}).pipe(fs.createWriteStream(p));   

// WORK MP4
// var p = "./temp/youtubelastvideo.mp4";
// ytdl(url, {filter: "videoandaudio"}).pipe(fs.createWriteStream(p))


//WORK WEBM
var p = "./temp/youtubelastvideo.webm";
ytdl(url, {filter: "videoandaudio"}).pipe(fs.createWriteStream(p))