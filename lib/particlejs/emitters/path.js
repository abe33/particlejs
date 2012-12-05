(function() {
  var Path, geomjs;

  geomjs = require('geomjs');

  Path = (function() {

    function Path(path) {
      this.path = path;
    }

    Path.prototype.get = function() {
      return this.path.pathPointAt(this.random.get());
    };

    return Path;

  })();

  module.exports = Path;

}).call(this);
