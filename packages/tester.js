(function() {

  $(document).ready(function() {
    var canvas, context, stats, system;
    stats = new Stats;
    stats.setMode(0);
    $('#canvas').after(stats.domElement);
    canvas = $("#canvas");
    context = canvas[0].getContext('2d');
    system = new particlejs.System(new particlejs.Life(3000, 4000), new particlejs.MacroAction([new particlejs.Live, new particlejs.Move, new particlejs.Force(new geomjs.Point(5, 20)), new particlejs.Friction(0.2)]), new particlejs.SubSystem(new particlejs.Life(800, 1200), new particlejs.MacroAction([new particlejs.Live, new particlejs.Move, new particlejs.Force(new geomjs.Point(5, 20)), new particlejs.Friction(0.2)]), function(particle) {
      return new particlejs.Emission(particlejs.Particle, new particlejs.Ponctual(particle.position.clone()), new particlejs.Limited(10), new particlejs.Fixed(20), new particlejs.Explosion(10, 20));
    }));
    particlejs.Impulse.instance().stats = stats;
    return canvas.click(function(e) {
      var x, y;
      if (!particlejs.Impulse.instance().running) {
        particlejs.Impulse.instance().add(function() {
          var particle, particles, _i, _len, _results;
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, 640, 480);
          context.fillStyle = '#000000';
          particles = system.particles;
          particles = particles.concat(system.subSystem.particles);
          _results = [];
          for (_i = 0, _len = particles.length; _i < _len; _i++) {
            particle = particles[_i];
            _results.push(context.fillRect(particle.position.x, particle.position.y, 1, 1));
          }
          return _results;
        });
      }
      x = e.pageX - canvas.offset().left;
      y = e.pageY - canvas.offset().top;
      return system.emit(new particlejs.Emission(particlejs.Particle, new particlejs.Ponctual(new geomjs.Point(x, y)), new particlejs.Unlimited(), new particlejs.ByRate(2), new particlejs.Stream(new geomjs.Point(1, -1), 10, 20, 0.2)));
    });
  });

}).call(this);
