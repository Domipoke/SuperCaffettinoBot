var {Client,Collection} = require("discord.js")
var express = require("express")
var sql = {
    getUser: (a)=>'SELECT 1 FROM user WHERE username = "'+a+'";',
    setCode: (u,c)=>'UPDATE user SET code = "'+c+'" WHERE username = "'+u+'";',
    getCode: (u)=>'SELECT code FROM user WHERE username = "'+u+'";',
    addUser: (u,c)=>'INSERT INTO user (username, code) VALUES ("'+u+'", "'+c+'");'
}
var mysql = require("mysql")
var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password:"SuperCaffettinoBot",
    database: "bot"
})
con.connect((err,args)=>{
    if (err) console.log(err)
    if (args) console.log("SQL:Start ",args)
    console.log("*Remember to start DUC and SQL-Service: SuperCaffettinoBot")
})
function setnewip() {
    // fetch("https://ydns.io/api/v1/ip").then((data) =>{
    //   data.text().then((ip)=>{
    //       fetch("https://ydns.io/hosts/update/n9D9bnZ2DwjEYJLictB4M3Mf?host=caffettino.ydns.eu&ip="+ip).then(x=>{
    //           x.text().then(r=>console.log(r))
    //       }).catch(e=>console.log(e))
    //   })
    // })
}
/**
 * 
 * @param {Client} client,
 * @param {Collection} cmds
 */
module.exports = function (client,cmds) {
    //setnewip()
    //var sessionpath=require("node:path").join(__dirname, "./database/pwd.db")
    var app = express();
    const randomId = () => Math.floor(100000 + Math.random() * 900000).toString();
    // var redisClient = new Redis();
    // const { RedisSessionStore } = require("./class/sessionStore.js");
    // const sessionStore = new RedisSessionStore(redisClient);
    app.use('/favicon.ico', express.static(require("node:path").join(__dirname,'pages/coffee.png')));
    app.get("/", (req,res,next)=>res.sendFile(require("node:path").join(__dirname,"./pages/home.html")))
    app.get("/home.js", (req,res,next)=>res.sendFile(require("node:path").join(__dirname,"./pages/home.js")))
    app.get("/opt", (req,res,next)=>res.sendFile(require("node:path").join(__dirname,"./pages/opt.html")))
    app.get("/opt.js", (req,res,next)=>res.sendFile(require("node:path").join(__dirname,"./pages/opt.js")))
    app.get("/lg.js", (req,res,next)=>res.sendFile(require("node:path").join(__dirname,"./pages/lg.js")))
    //app.get("/api.js", (req,res,next)=>res.sendFile(require("node:path").join(__dirname,"./pages/api.js")))
    app.get("/api", (req,res,next)=>{
        var params = req.query
        var url = params.url
        var us = params.username
        var cd = params.code
        var text = params.text
        console.log(url,us,cd, text)
        if (
            url && us && cd && text
        ) {
            con.query(sql.getCode(us.toString()),(err,result,fields)=>{
                console.log("SQL:GetCode: ",err,result,fields)
                if (err) console.log(err);
                if (result) {
                    if (result[0]) {
                        if (result[0]["code"]==cd) {
                            res.send("Sent")
                            require("api").parseCdmFromText(client,cmds,data.text)
                        } else {
                            res.send("Error: Code is invalid")
                        }
                    }
                }
            })
        }
    })
    // var privateKey  = fs.readFileSync('ssl/server.key', 'utf8');
    // var certificate = fs.readFileSync('ssl/server.crt', 'utf8');

    // var credentials = {key: privateKey, cert: certificate};
    var httpServer = require("node:http").createServer(app);
    var options = { 
        //DA CAPIRE cos'è
        // adapter: require("socket.io-redis")({
        //     pubClient: redisClient,
        //     subClient: redisClient.duplicate(),
        // }),
    };
    var io = require("socket.io")(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    // io.use(async (socket, next) => {
    //     next();
    // });
    
    io.on("connection", async (socket) => { 
        console.log("Connected")
        socket.onAny((...args)=>{console.log(...args);})
        socket.on("sendcode",(data)=>{
            console.log(data)
            var us = data.username.toString()//.toLowerCase()
            if (!RegExp(/^((.+?)#\d{4})/).test(us)) {console.log("Invalid user: "+us);return;}
            //??interaction.user
            //var Datastore = require("nedb")
            var randomcode=randomId()
            con.query(sql.getUser(us),(err, result, fields)=>{
                if (err) {console.log("SQL:SearchUserdb",err)}
                console.log(err,result,fields)
                if (result) {
                    // Log in
                    // con update code
                    con.query(sql.setCode(us,randomcode),(berr,bresult,bfiels)=>{
                        console.log("SQL:setCode",berr,bresult,bfiels)
                    })
                } else {
                    // Register
                    // con add user
                    con.query(sql.addUser(us,randomcode),(berr,bresult,bfiels)=>{
                        console.log("SQL:addUSER",berr,bresult,bfiels)
                    })
                }
            })
            
            if(client.isReady()) {
                var g = client.guilds.cache.find(x=>x.id=="1065325163794673827")
                console.log(g.members.cache)
                var roles=g.roles.cache
                if (roles){
                    var role = roles.find(x=>x.name.toLowerCase()=="caffettino")
                    if (role){
                        var spl=us.split("#")
                        //var isin = role.find(x=>x.user.username.toLowerCase()==spl[0]&&x.user.discriminator==spl[1])
                        //var role = guild.members
                        var isin=role.members.find(x=>x.user.username==spl[0]&&x.user.discriminator==spl[1])
                        
                        if (isin) {
                            //isin.send("[----------------------]")
                            isin.send("Stai provando ad accedere al pannello di controllo come "+data.username)
                            isin.send("Questo è il tuo codice. Inserisci solo i numeri")
                            isin.send(randomcode)
                        }
                    } else{
                        console.log("no role, avaibles: ", g.roles.cache.map(x=>x.name))
                    }
                }else{
                    console.log(g.roles,roles)
                }
            }
            
        })
        
        socket.on("checkcode",async (data)=>{
            var us = data.username.toString()
            var cd = data.code
            if (!RegExp(/^((.+?)#\d{4})/).test(us)) {console.log("Invalid user: "+us);return;}
            if (!RegExp(/^(\d{6})/).test(cd)) {console.log("Invalid code: "+cd);return;}
            con.query(sql.getCode(data.username.toString()),(err,result,fields)=>{
                console.log("SQL:GetCode: ",err,result,fields)
                if (err) console.log(err);
                if (result) {
                    if (result[0]) {
                        if (result[0]["code"]==cd) {
                            socket.emit(data.onsuccess,data)
                        } else {
                            socket.emit(data.onerror,data)
                        }
                    }
                }
            })
        })
        socket.on("command",
            /**
             * @param {{
             *  username: string,
             *  code: string,
             *  command: {
             *   name: string,
             *   args: JSON,
             *  }
             * }} data
             */
            async (data)=>{
                if (data) {
                    console.log("Command processing...")
                    if (data.command) {
                        data.command.settings = {
                            guildId: "1065325163794673827"
                        }
                        if (data.command.name) {
                            var c = cmds.get(data.command.name)
                            if (c) {
                                c.serverexecute(client, data.command)
                            } else {
                                console.log("c not exist")
                            }
                        } else {
                            console.log("data command name not exist")
                        }
                    } else {
                        console.log("data command not exist")
                    }
                } else {
                    console.log("data not exist")
                }
            }
        )
        //DUCE O NON DUCE TODO
        socket.on("requestducelist",(data)=>{
            console.log("requestducelist: ",data)
            con.query("SELECT * FROM duceononduce",(err,result,fields)=>{
                if (err) {console.log("SQL:Searchducedb",err)}
                socket/*.to(data.id)*/.emit(data.onsuccess,result)
            })
        })
        socket.on("game_duceononduce",
            /**
             * @param {{name: string, lore: string, img: string}} data 
             */
            (data) =>{
                con.query('SELECT 1 FROM duceononduce WHERE name = "'+data.name+'";',(err, result, fields)=>{
                    if (err) {console.log("SQL:Searchducedb",err)}
                    console.log(err,result,fields)
                    if (result&&result.length>0) {
                        // Log in
                        // con update code
                        con.query('UPDATE duceononduce SET lore = "'+data.lore+'", image = "'+data.img+'" WHERE name = "'+data.name+'";',(berr,bresult,bfiels)=>{
                            console.log("SQL:setDuce",berr,bresult,bfiels)
                        })
                    } else {
                        // Register
                        // con add user
                        con.query('INSERT INTO duceononduce (name, lore, image) VALUES ("'+data.name+'", "'+data.lore+'", "'+data.img+'");',(berr,bresult,bfiels)=>{
                            console.log("SQL:addduce",berr,bresult,bfiels)
                        })
                    }
                })
            }
        )
        //YOUTUBE
        socket.on("get_yt",async (data)=>{
            console.log(data)
            var videos = await require('ytsr')(data.query, {
                limit: data.limit??20
            })
            
            socket.to(data.id).emit("yt_video_list",{
                res: videos.items
            })
        })
    });
    try { 
        httpServer.listen(4)
        //interaction.followUp("Server Binded")
    }catch(e){
        console.log(e)
        //interaction.followUp("Server Error")
    }
}