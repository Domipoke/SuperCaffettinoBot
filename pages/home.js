var username = localStorage.getItem("caffettino_username")
var code = localStorage.getItem("caffettino_code")
var url = localStorage.getItem("caffettino_socketurl")
var s = io(url)
s.on("lg", ()=>localStorage.setItem("caffettino_isLg","true"))
s.on("er", ()=>localStorage.setItem("caffettino_isLg","false"))
s.emit("checkcode",{
    username: username??"",
    code: code??"",
    socketId: s.id??"",
    onsuccess: "lg",
    onerror: "er"
})