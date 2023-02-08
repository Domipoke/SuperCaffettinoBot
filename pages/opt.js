var prefix = "caffettino_"
Array.from(document.getElementsByTagName("input")).forEach(e=>{
    e.value=localStorage.getItem(prefix+e.id)??""
})
document.getElementById("save").addEventListener("click",()=>{
    Array.from(document.getElementsByTagName("input")).forEach(e=>{
        localStorage.setItem(prefix+e.id,e.value)
    })
})