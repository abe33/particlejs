(function() {
  var Path, Randomizable;

  Randomizable = require('../mixins/randomizable');

  Path = (function() {

    Randomizable.attachTo(Path);

    function Path(path, random) {
      this.path = path;
      this.random = random;
      this.initRandom();
    }

    Path.prototype.get = function() {
      return this.path.pathPointAt(this.random.get());
    };

    return Path;

  })();

  module.exports = Path;

}).call(this);
