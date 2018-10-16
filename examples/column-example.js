const fs = require('fs')
const stream = require('stream')

const {CountUpTo, ExponentiateBy, LineLog} = require('./samplestreams')
const EventSeries = require('../bin/EventSeries') // a Readable stream class
const es2column = require('../bin/es2column') // a Transform stream class

let Source = new CountUpTo(5)
let Transform = new ExponentiateBy(2)
let Destination = new LineLog

let Observer = new EventSeries(Source, Transform, Destination)
/* or...
Oberver = new EventSeries()
Observer.observe(Source)
Observer.observe(Transform)
Observer.observe(Destination)
*/

Source.pipe(Transform).pipe(Destination)
Observer.pipe(new es2column).pipe(process.stderr)
