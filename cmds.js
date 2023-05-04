var { tsCommandFile } = require("./class/commands");
var download = require("./commands/download");
var duce = require("./commands/duce");
var join = require("./commands/join");
var play = require("./commands/play");
var playlist = require("./commands/playlist");
var print = require("./commands/print");
/**
 * @type {tsCommandFile[]}
 */
export const cmds= [
    download.cmd,
    duce.cmd,
    join.cmd,
    play.cmd,
    playlist.cmd,
    print.cmd,
]