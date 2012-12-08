
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

  particlejs.Impulse.instance().stats = stats

  canvas.click (e) ->
    unless particlejs.Impulse.instance().running
      particlejs.Impulse.instance().add ->

        context.fillStyle = '#ffffff'
        context.fillRect(0,0,640,480)

        context.fillStyle = '#000000'
        for particle in system.particles
          context.fillRect(particle.position.x, particle.position.y, 1, 1)

    x = e.pageX - canvas.offset().left
    y = e.pageY - canvas.offset().top
    system.emit new particlejs.Emission(
      particlejs.Particle,
      new particlejs.Ponctual(new geomjs.Point(x, y)),
      new particlejs.Unlimited(),
      new particlejs.ByRate(10),
      new particlejs.Explosion(10,20)
      # new particlejs.Stream(new geomjs.Point(1,-1),5,10,0.2)
    )

