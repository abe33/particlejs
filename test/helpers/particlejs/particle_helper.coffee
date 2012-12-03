
Particle = require '../../../lib/particlejs/particle'

global.particle = (source) ->
  life: testProperty source, 'life'
  maxLife: testProperty source, 'maxLife'
  dead: testProperty source, 'dead'
