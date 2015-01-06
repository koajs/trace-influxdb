
var Influx = require('influxdb-udp')

module.exports = function (options) {
  options = options || {}
  var influx = Influx(options)

  // prefix for the series
  // note: you can have '' as the prefix, i.e. no prefix
  var prefix = typeof options.prefix === 'string'
    ? options.prefix
    : 'trace.'
  if (prefix && !/\.$/.test(prefix)) prefix += '.'

  return function (context, event, date, args) {
    var obj = {
      time: Date.now(),
    }

    var id = context.id
    if (Buffer.isBuffer(id)) id = id.toString('base64')
    if (id) obj.id = id

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

    influx.write(prefix + event, obj)

    return obj
  }
}
