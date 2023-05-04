

console.log(params)

tryConnection(url,us,cd,text)
function tryConnection(url,us,cd,text) {
    if (url=="") {return}
    if (us=="") {return}
    if (cd=="") {return}
    if (text=="") {return}
    var s = io(url)
    s.on("api_lg", ()=>{
        document.write({
            logged: true,
            online: true,
            url: url,
            us: us,
            cd: cd,
            cmd: cmd
        });s.emit("cmd", text)})
    s.on("api_er", ()=>document.write({
        logged: false,
        online: true,
        url: url,
        us: us,
        cd: cd,
        cmd: cmd
    }))
    
}