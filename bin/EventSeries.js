const stream = require('stream')

/**
 * EventSeries emits objects describing the
 * You can pipe it to an ldjson file with es2ldjson.js
 * You can pipe it to column-oriented console output with es2column.js
 */
module.exports = class EventSeries extends stream.Readable {
    constructor(){
        super({objectMode: true})
        this.eventSeries = new Array
        this.streamSeries = new Array

        Array.from(arguments).forEach(newStream => {
            this.observe(newStream)
        })
    }

    _read(){ /* nothing happens here. everything is pushed on event */ }

    /**
     * @param {object} newStream
     * Observe can be called on any stream. Attaches spies and even listeners.
     */
    observe(newStream){
        if(!arguments.length || arguments.length > 1) throw new Error("Observe takes a single argument. To pass multiple arguments use the EventSeries constructor.")
        if(!(newStream instanceof stream)) throw new Error("This isn't going to work if you don't feed me a stream.")
        this.attachSpies(newStream)
        this.attachEvents(newStream)
        this.streamSeries.push(newStream)
        return newStream
    }

    /**
     * @param {Object} newStream
     * Iterates the names of events that may be fired from a stream
     * Pushes an event object as a callback.
     */
    attachEvents(newStream){
        [
            'close',
            'data',
            'end',
            'error',
            'drain',
            'finish',
            'pipe',
            'unpipe',
            // 'readable'
        ].forEach(eventName => {
            newStream.prependListener(eventName, event => {
                this.push({
                    source: newStream.constructor.name,
                    event: eventName + ' =>',
                    index: this.streamSeries.indexOf(newStream)
                })
            })
        })
    }

    /**
     * @param {Object} newStream
     * Iterates the names of functions you'd like to be notified of
     * Skips functions if they don't exist on target newStream
     * Binds original function to original contexts
     * Overwrites original function with a spied-on function
     * Which pushes an object every time a spied on function is called
     */
    attachSpies(newStream){
        [
            '_read',
            '_write',
            '_transform',
            '_destroy',
            '_flush',
            '_finish',
        ].forEach(spyName => {
            if(!newStream[spyName]) return null
            // console.log(newStream.constructor.name, spyName)
            let spyee = newStream[spyName].bind(newStream)
            let spycallback = (function(){
                this.push({
                    source: newStream.constructor.name,
                    calls: spyName + '()',
                    index: this.streamSeries.indexOf(newStream)
                })
            }).bind(this)

            newStream[spyName] = function(){
                spycallback()
                return spyee(...arguments)
            }
        })
    }
}
