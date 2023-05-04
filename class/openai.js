var {OpenAIApi, Configuration} =require("openai")

class Ai {
    openai
    constructor() {
        this.openai = new OpenAIApi(new Configuration({
            organization: "org-HSCY8UEEEo0g0jsFeOVJutNB",
            apiKey: "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",
        }))
    }
    /**
     * 
     * @param {string} prompt 
     */
    async ask(prompt) {
        var comp = await this.openai.createCompletion({
            prompt: prompt,
            best_of: 1,
            model: "text-davinci-003",
            max_tokens:2048,
            temperature: 0.6,
        })
        console.log(comp.data.choices)
        return comp.data.choices[0].text
    }
    async draw(prompt) {
        return await this.openai.createImage({
            prompt: prompt,
            n:1,
            size: "1024x1024"
        })
    }
    // destroy() {
    //     this=null
    // }
}
const DuceEnum = {
    nullo: 0,
    duce: 1,
    nonduce: 2,
}

class DuceONonDuce extends Ai {
    constructor () {
        super()
    }
    /**
     * @param {Array<string>} arr
     */
    list(arr, sing, plur) {
        if (arr.length>2) {
            var last = arr.pop()
            return arr.join(", ")+" e "+last+" "+plur
        } else if (arr.length==2) {
            return arr.join(" e ")+" "+plur
        } else if (arr.length==1) {
            return arr[0]+" "+sing
        } else {
            return "nessuno "+sing
        }
    }
    /**
     * @param {0,1,2} isDuce
     * @param {Array<string>} pro
     * @param {Array<string>} contro
     * @param {{name: string, lore: string, image: string}} dux
     */
    async description(isDuce, pro, contro, dux) {
        var response = ""
        switch (isDuce) {
            case 0:
                var p = "Descrivi il futuro colpo di stato di " + dux.name+"!"
                response = await this.ask(p)??""
                break;
            case 1:
                var p = this.list(pro, "ha", "hanno") +" eletto "+dux.name+" duce!" 
                response = await this.ask(p)??""
                break;
            case 2:
                var p = this.list(contro, "ha", "hanno") +" costretto "+dux.name+" a una vita da plebeo!"
                response = await this.ask(p)??""
                break;
        }
        console.log(
            "---------------------"+
            "\nisDuce: "+isDuce,
            "\npro: "+pro,
            "\ncontro: "+contro,
            "\ndux: "+JSON.stringify(dux),
            "\nresponse: "+response,
            "\n---------------------"
        )
        return response;
    }
}
module.exports = {
    Ai, DuceEnum, DuceONonDuce
}