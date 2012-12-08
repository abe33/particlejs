mixinsjs = require 'mixinsjs'
chancejs = require 'chancejs'

{Mixin} = mixinsjs
{Random, MathRandom} = chancejs

DEFAULT_RANDOM = new Random new MathRandom

class Randomizable extends Mixin
  initRandom: -> @random ||= DEFAULT_RANDOM

module.exports = Randomizable
