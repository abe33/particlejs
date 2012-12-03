(function() {

  $(document).ready(function() {
    var canvas, context, stats, system;
    stats = new Stats;
    stats.setMode(0);
    $('#canvas').after(stats.domElement);
    canvas = $("#canvas");
    context = canvas[0].getContext('2d');
    system = new particlejs.System(new particlejs.Life(10000), new particlejs.MacroAction([new particlejs.Live, new particlejs.Move]));
    canvas.click(function(e) {
      var x, y;
      x = e.pageX - canvas.offset().left;
      y = e.pageY - canvas.offset().top;
      return system.emit(new particlejs.Emission(particlejs.Particle, new particlejs.Ponctual(new geomjs.Point(x, y)), new particlejs.Limited(1000), new particlejs.ByRate(10), {
        initialize: function(particle) {
          particle.velocity.x = 10 - Math.random() * 20;
          return particle.velocity.y = 10 - Math.random() * 20;
        }
      }));
    });
    return particlejs.Impulse.instance().add(function() {
      var particle, _i, _len, _ref;
      stats.begin();
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, 640, 480);
      context.fillStyle = '#000000';
      _ref = system.particles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        particle = _ref[_i];
        context.fillRect(particle.position.x, particle.position.y, 1, 1);
      }
      return stats.end();
    });
  });

}).call(this);
