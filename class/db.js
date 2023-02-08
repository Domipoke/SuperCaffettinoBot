class Database {
    constructor (path) {
        
    }
    set() {
        this.db.loadDatabase()
        this.db.insert()
    }
    modify(query) {
        this.db.findOne(query)
    }
    get() {

    }
    close(){this.db.close()}
}

