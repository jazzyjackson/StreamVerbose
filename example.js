const {CountUpTo, ExponentiateBy, LineLog} = require('./samplestreams.js')
const EventSeries = require('./EventSeries')
const es2json = require('./es2json')
const fs = require('fs')
const stream = require('stream')

let Source = new CountUpTo(5)
let Transform = new ExponentiateBy(2)
let Destination = new LineLog

let Observer = new EventSeries(Source, Transform, Destination)

Source.pipe(Transform).pipe(Destination)
Observer.pipe(new es2json).pipe(process.stderr)
