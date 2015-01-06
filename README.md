
# koa-trace-influxdb

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]
[![Gittip][gittip-image]][gittip-url]

Tracing for [koa-trace](https://github.com/koajs/trace) using [influxdb-udp](https://github.com/jonathanong/node-influxdb-udp).

## Usage

```js
var app = koa();
require('koa-trace')(app);

var traceInflux = require('koa-trace-influxdb');
app.instrument(traceInflux({
  port: 4444,
  host: '127.0.0.1'
}));

app.use(function* (next) {
  // set an ID for every request.
  // optionally, make this a request UUID
  this.id = '1234';

  // optionally set properties to add to all traces
  this.traces = {
    user_id: this.session.user_id.toString('hex')
  };

  // trace something
  this.trace('start')
})
```

This will create a time series called `koa-trace.start`.
Thus, it tracks each event as a separate series.
You probably want to track the elapsed time.

```js
app.use(function* (next) {
  var start = Date.now();

  yield* next;

  this.trace('response-time', {
    elapsed: Date.now() - start
  });
});
```

You may want to build your own helper for this.

## Limitations

- The trace arguments must only be a single object, if anything at all.
- UDP is used underneath, so you may lose events.
  There is no error reporting for logging these.

[gitter-image]: https://badges.gitter.im/koajs/trace-influxdb.png
[gitter-url]: https://gitter.im/koajs/trace-influxdb
[npm-image]: https://img.shields.io/npm/v/koa-trace-influxdb.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-trace-influxdb
[github-tag]: http://img.shields.io/github/tag/koajs/trace-influxdb.svg?style=flat-square
[github-url]: https://github.com/koajs/trace-influxdb/tags
[travis-image]: https://img.shields.io/travis/koajs/trace-influxdb.svg?style=flat-square
[travis-url]: https://travis-ci.org/koajs/trace-influxdb
[coveralls-image]: https://img.shields.io/coveralls/koajs/trace-influxdb.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/koajs/trace-influxdb
[david-image]: http://img.shields.io/david/koajs/trace-influxdb.svg?style=flat-square
[david-url]: https://david-dm.org/koajs/trace-influxdb
[license-image]: http://img.shields.io/npm/l/koa-trace-influxdb.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/koa-trace-influxdb.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/koa-trace-influxdb
[gittip-image]: https://img.shields.io/gratipay/jonathanong.svg?style=flat-square
[gittip-url]: https://gratipay.com/jonathanong/
