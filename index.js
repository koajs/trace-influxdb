
var Influx = require('influxdb-udp')

module.exports = function (options) {
  var influx = Influx(options)

  return function (context, event, date, args) {
    var id = context.id
    if (Buffer.isBuffer(id)) id = id.toString('base64')

    var obj = {
      id: id,
      time: Date.now(),
    }

    if (context.traces) {
      Object.keys(context.traces).forEach(function (key) {
        obj[key] = context.traces[key]
      })
    }

    var arg = args[0]
    if (typeof arg === 'object' && !Array.isArray(arg)) {
      Object.keys(arg).forEach(function (key) {
        obj[key] = arg[key]
      })
    }

    influx.write('koa-trace.' + event, obj)

    return obj
  }
}
