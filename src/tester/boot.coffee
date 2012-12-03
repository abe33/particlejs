
$(document).ready ->
  stats = new Stats
  stats.setMode 0

  $('#canvas').after(stats.domElement)

  canvas = $("#canvas")
  context = canvas[0].getContext('2d')

  system = new particlejs.System(
    new particlejs.Life(10000),
    new particlejs.MacroAction([
      new particlejs.Live,
      new particlejs.Move
    ])
  )

  # system.particlesCreated.add (o,p) -> console.log 'particlesCreated'
  # system.particlesDied.add (o,p) -> console.log 'particlesDied'
  # system.emissionStarted.add (o,p) -> console.log 'emissionStarted'
  # system.emissionFinished.add (o,p) -> console.log 'emissionFinished'

  canvas.click (e) ->
    x = e.pageX - canvas.offset().left
    y = e.pageY - canvas.offset().top
    system.emit new particlejs.Emission(
      particlejs.Particle,
      new particlejs.Ponctual(new geomjs.Point(x, y)),
      new particlejs.Limited(1000),
      new particlejs.ByRate(10),
      initialize: (particle) ->
        particle.velocity.x = 10 - Math.random() * 20
        particle.velocity.y = 10 - Math.random() * 20
    )

  particlejs.Impulse.instance().add ->
    stats.begin()

    context.fillStyle = '#ffffff'
    context.fillRect(0,0,640,480)

    context.fillStyle = '#000000'
    for particle in system.particles
      context.fillRect(particle.position.x, particle.position.y, 1, 1)

    stats.end()
