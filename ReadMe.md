# StreamVerbose

StreamVerbose aims to provide some utilities to help illustrate the innerworkings of NodeJS pipelines. This should be especially helpful for implementing nontrivial custom transform streams.

To start off, you can require the EventSeries and set it up to obverse your streams interacting in one of two ways:
```js
let observer = new EventSeries(Source, Transform, Destination)
// OR
let observer = new EventSeries()
observer.observe(Source)
observer.observe(Transform)
observer.observe(Destination)
```
Note that while the EventSeries constructor is variadic, the observe function is not!
You can also pass one or more streams to the constructor and add more streams later by calling observe.

EventSeries is an object stream. Provided are two options to format the output.

es2column looks like:
```js
observer.pipe(new es2column).pipe(process.stdout)
```

```
CountUpTo      ExponentiateBy LineLog
               pipe =>
                               pipe =>
_read()
_read()
data =>
               _write()
               _read()
               _transform()
               data =>
                               _write()
               _read()
_read()
data =>
               _write()
               _read()
               _transform()
               data =>
                               _write()
               _read()
_read()
data =>
               _write()
               _read()
               _transform()
               data =>
                               _write()
               _read()
_read()
data =>
               _write()
               _read()
               _transform()
               data =>
                               _write()
               _read()
_read()
data =>
               _write()
               _read()
               _transform()
               data =>
                               _write()
               _read()
               _read()
end =>
               _flush()
               finish =>
               unpipe =>
               end =>
                               finish =>
                               unpipe =>
```

I'm also imagining some cool real time visualizations by tailing the ldjson file you can get by piping EventSeries through es2json and then piping to a destination file:
```js
observer.pipe(new es2json).pipe(process.stdout)
```
```JSON
{"source":"ExponentiateBy","event":"pipe =>","index":1}
{"source":"LineLog","event":"pipe =>","index":2}
{"source":"CountUpTo","calls":"_read()","index":0}
{"source":"CountUpTo","calls":"_read()","index":0}
{"source":"CountUpTo","event":"data =>","index":0}
{"source":"ExponentiateBy","calls":"_write()","index":1}
{"source":"ExponentiateBy","calls":"_read()","index":1}
{"source":"ExponentiateBy","calls":"_transform()","index":1}
{"source":"ExponentiateBy","event":"data =>","index":1}
{"source":"LineLog","calls":"_write()","index":2}
{"source":"ExponentiateBy","calls":"_read()","index":1}
{"source":"CountUpTo","calls":"_read()","index":0}
{"source":"CountUpTo","event":"data =>","index":0}
{"source":"ExponentiateBy","calls":"_write()","index":1}
{"source":"ExponentiateBy","calls":"_read()","index":1}
{"source":"ExponentiateBy","calls":"_transform()","index":1}
{"source":"ExponentiateBy","event":"data =>","index":1}
{"source":"LineLog","calls":"_write()","index":2}
{"source":"ExponentiateBy","calls":"_read()","index":1}
{"source":"CountUpTo","calls":"_read()","index":0}
{"source":"CountUpTo","event":"data =>","index":0}
{"source":"ExponentiateBy","calls":"_write()","index":1}
{"source":"ExponentiateBy","calls":"_read()","index":1}
{"source":"ExponentiateBy","calls":"_transform()","index":1}
{"source":"ExponentiateBy","event":"data =>","index":1}
{"source":"LineLog","calls":"_write()","index":2}
{"source":"ExponentiateBy","calls":"_read()","index":1}
{"source":"CountUpTo","calls":"_read()","index":0}
{"source":"CountUpTo","event":"data =>","index":0}
{"source":"ExponentiateBy","calls":"_write()","index":1}
{"source":"ExponentiateBy","calls":"_read()","index":1}
{"source":"ExponentiateBy","calls":"_transform()","index":1}
{"source":"ExponentiateBy","event":"data =>","index":1}
{"source":"LineLog","calls":"_write()","index":2}
{"source":"ExponentiateBy","calls":"_read()","index":1}
{"source":"CountUpTo","calls":"_read()","index":0}
{"source":"CountUpTo","event":"data =>","index":0}
{"source":"ExponentiateBy","calls":"_write()","index":1}
{"source":"ExponentiateBy","calls":"_read()","index":1}
{"source":"ExponentiateBy","calls":"_transform()","index":1}
{"source":"ExponentiateBy","event":"data =>","index":1}
{"source":"LineLog","calls":"_write()","index":2}
{"source":"ExponentiateBy","calls":"_read()","index":1}
{"source":"ExponentiateBy","calls":"_read()","index":1}
{"source":"CountUpTo","event":"end =>","index":0}
{"source":"ExponentiateBy","calls":"_flush()","index":1}
{"source":"ExponentiateBy","event":"finish =>","index":1}
{"source":"ExponentiateBy","event":"unpipe =>","index":1}
{"source":"ExponentiateBy","event":"end =>","index":1}
{"source":"LineLog","event":"finish =>","index":2}
{"source":"LineLog","event":"unpipe =>","index":2}
```

A planned improvement is to include a 'captureState: true' option in EventSeries' constructor that copies all the propeties of a stream object before and after each event, so you can inspect how these internal changes are affected by events.
