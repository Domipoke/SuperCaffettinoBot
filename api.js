/**
 * 
 * @param {import("discord.js").Client} client,
 * @param {import("discord.js").Collection<string, any>} cmds
 * @param {string} text
 */
export function parseCdmFromText(client,cmds,text) {
    // /play url:http
    // [/play, url:http]
    // cmd = play
    // args = [ [url,http] ]
    var split = text.split(" ")
    var cmd = split.shift().slice(1)
    var args = {}
    split.forEach((x)=>{
        var ar = x.split(":")
        var k = ar.shift()
        var v = ar.join(":")
        args[k]=v
    })

    var f = cmds.get(cmd)
    if (f!=null) {
        if (f.api!=null) {
            f.api(client,cmd,args)
        }
    }
}