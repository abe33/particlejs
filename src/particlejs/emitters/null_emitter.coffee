geomjs = require 'geomjs'

{Point} = geomjs

class NullEmitter
  get: -> new Point

module.exports = NullEmitter
