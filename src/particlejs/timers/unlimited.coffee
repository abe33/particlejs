Limited = require './limited'

class Unlimited extends Limited
  constructor: (since) -> super Infinity, since
  finished: -> false

module.exports = Unlimited
