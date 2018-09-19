let stream = require('stream')
let {Readable, Writable, Transform} = stream

module.exports = {
    CountUpTo: class CountUpTo extends Readable {
        constructor(max){
            super()
            this.max = max
            this.curr = 0
        }

        _read(size){
            this.push(this.curr < this.max ? String(this.curr++) : null)
        }
    },

    ExponentiateBy: class ExponentiateBy extends Transform {
        constructor({exponent, errorProbability}){
            super()
            this.exp = exponent
            this.err = errorProbability
        }

        _transform(chunk, encoding, done){
            let error = Math.random() < this.err ? new Error("Bang!") : null
            let result = String(Math.pow(chunk, this.exp))
            done(error, result)
        }

        _flush(done){
            done()
        }
    },

    LineLog: class LineLog extends Writable {
        constructor(){
            super()
            this.on('pipe', src => {
                src.on('error', err => {
                    console.error(err)
                    src.destroy()
                })
            })
        }

        _write(chunk, encoding, done){
            process.stdout.write(chunk + '\n')
            // console.log(chunk)
            done()
        }
    }
}
