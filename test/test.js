
var request = require('supertest')
var assert = require('assert')
var koa = require('koa')

var app = koa()
require('koa-trace')(app)
app.instrument(require('..')())

app.use(function* (next) {
  this.id = '1234'
  yield* next
})

it('should create an object', function (done) {
  app.use(function* (next) {
    if (this.path !== '/1') return yield* next

    this.status = 204
    this.trace('asdf');
  })

  request(app.listen())
  .get('/1')
  .expect(204, done)
})

it('should create use the argument', function (done) {
  app.use(function* (next) {
    if (this.path !== '/2') return yield* next

    this.status = 204
    this.trace('asdf', {
      c: 1
    });
  })

  request(app.listen())
  .get('/2')
  .expect(204, done)
})

it('should create use the trace object', function (done) {
  app.use(function* (next) {
    if (this.path !== '/3') return yield* next

    this.status = 204
    this.traces = {
      a: 1
    }
    this.trace('asdf')
  })

  request(app.listen())
  .get('/3')
  .expect(204, done)
})

it('should create use both the argument and the trace object', function (done) {
  app.use(function* (next) {
    if (this.path !== '/4') return yield* next

    this.status = 204
    this.traces = {
      a: 1
    }
    this.trace('asdf', {
      c: 1
    })
  })

  request(app.listen())
  .get('/4')
  .expect(204, done)
})
