var axios =require("axios")
var {parse} = require("node-html-parser")
/**
 * 
 * @param {string} url 
 * @returns {HTMLElement} 
 */
async function requestBody(url) {
    /**
     * @type {{status,statusText,headers,config,request,data}}
     */
    var ax = new axios.Axios({
        method: "get"
    })
    var g = ax.get(url)
    return parse(await x.data)
}   
async function searchForLyrics(query) {
    var res = requestBody("https://www.megalobiz.com/search/all?qry="+query)
    console.log(res)
    // var lcs = Array.from(res.getElementsByClassName("entity_name")).map(function(x) {
    //     return {
    //         name: x.getAttribute("name"),
    //         title: x.getAttribute("title"),
    //         href: x.getAttribute("href"),
    //         id: x.getAttribute("id"),
    //         inner: x.innerHTML
    //     }
    // })
    // console.log(lcs)
}

searchForLyrics("Gurenge")