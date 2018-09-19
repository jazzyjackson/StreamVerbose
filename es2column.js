const stream = require('stream')

/**
 * An output transform of EventSeries: outputs events and function calls in columns
 * Suitable for piping to process.stdout or a file.
 */
module.exports = class es2column extends stream.Transform {
    constructor(options = {colWidth: 20}){
        super({objectMode: true})
        this.colWidth = options.colWidth
        this.on('pipe', source => {
            this.push(source.streamSeries.map(eachStream => {
                let name = eachStream.constructor.name
                let whitespace = Math.max(0, this.colWidth - name.length)
                return name + new Array(whitespace).join(' ')
            }).join('') + '\n')
        })
    }

    _transform(obj, encoding, done){
        let padding = new Array(obj.index * this.colWidth).join(' ')
        let text = (obj.event || obj.calls) + '\n'
        done(null, padding + text)
    }
}
