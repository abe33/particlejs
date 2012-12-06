(function() {
  var MacroInitializer;

  MacroInitializer = (function() {

    function MacroInitializer(initializers) {
      this.initializers = initializers;
    }

    MacroInitializer.prototype.initialize = function(particle) {
      var initializer, _i, _len, _ref, _results;
      _ref = this.initializers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        initializer = _ref[_i];
        _results.push(initializer.initialize(particle));
      }
      return _results;
    };

    return MacroInitializer;

  })();

  module.exports = MacroInitializer;

}).call(this);
