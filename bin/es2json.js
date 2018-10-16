const stream = require('stream')

module.exports = class es2json extends stream.Transform {
    constructor(){
        super({objectMode: true})
    }

    _transform(obj, encoding, done){
        done(null, JSON.stringify(obj) + '\n')
    }
}
