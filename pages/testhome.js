const socket = io("http://caffettino.ddns.net:4")
socket.emit("checkcode",{
    username: localStorage.getItem("discordUsername")??"",
    code: localStorage.getItem("discordCode")??"",
    socketId: socket.id,
    onsuccess: "disable",
    onerror: "enable"
})
socket.on("disable", (()=>{
    Array.from(document.getElementsByClassName("logged")).forEach(x=>{x.setAttribute("islogged","true");x.style.display="inline-flex"})
    Array.from(document.getElementsByClassName("prompt")).forEach(x=>{x.disabled="true";x.style.display="none"})  
    document.getElementById("lbusername").innerHTML=localStorage.getItem("discordUsername")  
}))
socket.on("enable", (()=>{
    Array.from(document.getElementsByClassName("prompt")).forEach(x=>{x.disabled="false";x.style.display="inline-flex"})    
}))
var userinp = document.getElementById("username")
var codeinp = document.getElementById("code")
document.getElementById("login").addEventListener("click",()=>{
    Array.from(document.getElementsByClassName("prompt")).forEach(x=>{if (!x.disabled) {x.style.display=x.style.display=="inline-flex"?"none":"inline-flex"}})    
    Array.from(document.getElementsByClassName("logged")).forEach(x=>{x.style.display=(x.getAttribute("islogged")=="true")?"inline-flex":"none"})
})
document.getElementById("sendcode").addEventListener("click",()=>{
    var iu = userinp.value
    var ic = codeinp.value

    console.log("1opass")
    if (RegExp(/^((.+?)#\d{4})/).test(iu)) {
        console.log("2opass")
        if (RegExp(/^(\d{6})/).test(ic)) {
            console.log("3pass")
            socket.emit("checkcode",{
                username:iu,
                code:ic,
                socketId: socket.id,
                onsuccess: "login",
                onerror: "error"
            })
        } else {
            socket.emit("sendcode",{
                username: iu,
                socketId: socket.id
            })
        }
    } else {
        userinp.style.color="#cf352e"
    }
})
userinp.addEventListener("change",()=>{
    var iu = userinp.value
    if (RegExp(/^((.+?)#\d{4})/).test(iu)) {
        userinp.style.color="#4BB543"
    } else {
        userinp.style.color="#cf352e"
    }
})
userinp.addEventListener("keypress",()=>{
    var iu = userinp.value
    if (RegExp(/^((.+?)#\d{4})/).test(iu)) {
        userinp.style.color="#4BB543"
    } else {
        userinp.style.color="#cf352e"
    }
})
socket.on("login", (data)=>{
    localStorage.setItem("discordUsername",data.username)
    localStorage.setItem("discordCode",data.code)
    //document.cookie=JSON.stringify({username: data.username, code: data.code})
    Array.from(document.getElementsByClassName("prompt")).forEach(x=>{x.style.display="none"; x.disabled=true})
    Array.from(document.getElementsByClassName("logged")).forEach(x=>{x.setAttribute("islogged","true");x.style.display="inline-flex"})
    //
    document.getElementById("lbusername").innerHTML=localStorage.getItem("discordUsername")
})  
socket.on("error", (data)=>{console.log("error",data); codeinp.value=""})  