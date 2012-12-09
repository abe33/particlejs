
$(document).ready ->
  stats = new Stats
  stats.setMode 0

  $('#canvas').after(stats.domElement)

  particleSubSystem = new particlejs.ParticleSubSystem(
    new particlejs.Life(800,1200),
    new particlejs.MacroAction([
      new particlejs.Live,
      new particlejs.Move,
      new particlejs.Force(new geomjs.Point(5, 20))
      new particlejs.Friction(0.2)
    ]),
    (particle) ->
      new particlejs.Emission(
        particlejs.Particle,
        new particlejs.Ponctual(particle.position),
        new particlejs.UntilDeath(particle),
        new particlejs.ByRate(10),
        initialize: (particle) -> particle.parasite.color = '#00ff00'
      )
  )

  canvas = $("#canvas")
  context = canvas[0].getContext('2d')
  system = new particlejs.System(
    new particlejs.MacroInitializer([
      new particlejs.Life(3000,4000),
      particleSubSystem
    ]),
    new particlejs.MacroAction([
      new particlejs.Live,
      new particlejs.Move,
      new particlejs.Force(new geomjs.Point(5, 20))
      new particlejs.Friction(0.2)
    ]),
    new particlejs.SubSystem(
      new particlejs.Life(800,1200),
      new particlejs.MacroAction([
        new particlejs.Live,
        new particlejs.Move,
        new particlejs.Force(new geomjs.Point(5, 20))
        new particlejs.Friction(0.2)
      ]),
      (particle) ->
        new particlejs.Emission(
          particlejs.Particle,
          new particlejs.Ponctual(particle.position.clone()),
          new particlejs.Limited(10),
          new particlejs.Fixed(20),
          new particlejs.MacroInitializer([
            new particlejs.Explosion(10,20),
            initialize: (particle) -> particle.parasite.color = '#ff0000'
          ])
        )
    )
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


        particles = system.particles
        particles = particles.concat(system.subSystem.particles)
        particles = particles.concat(particleSubSystem.subSystem.particles)
        for particle in particles
          context.fillStyle = particle.parasite.color
          context.fillRect(particle.position.x, particle.position.y, 1, 1)

    x = e.pageX - canvas.offset().left
    y = e.pageY - canvas.offset().top
    system.emit new particlejs.Emission(
      particlejs.Particle,
      new particlejs.Ponctual(new geomjs.Point(x, y)),
      new particlejs.Unlimited,
      new particlejs.ByRate(1),
      new particlejs.MacroInitializer([
        new particlejs.Stream(new geomjs.Point(1,-3),40,50,0.2),
        initialize: (particle) -> particle.parasite.color = '#000000'
      ])
    )

