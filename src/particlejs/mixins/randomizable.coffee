geomjs = require 'geomjs'
chancejs = require 'chancejs'

{Mixin} = geomjs
{Random, MathRandom} = chancejs

DEFAULT_RANDOM = new Random new MathRandom

class Randomizable extends Mixin
  initRandom: -> @random ||= DEFAULT_RANDOM

module.exports = Randomizable
