(function() {
  var Cloneable, Inlinable, MacroInitializer, Sourcable, include, mixinsjs;

  mixinsjs = require('mixinsjs');

  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  Inlinable = require('../mixins/inlinable');

  MacroInitializer = (function() {

    include([
      Inlinable({
        mapSource: {
          constructor: function() {
            return this.initializers.map(function(i) {
              return i.sourceFragment('constructor');
            }).join('\n');
          },
          initialize: function() {
            return this.initializers.map(function(i) {
              return i.sourceFragment('initialize');
            }).join('\n');
          }
        }
      }), Cloneable('initializers'), Sourcable('particlejs.MacroInitializer', 'initializers')
    ])["in"](MacroInitializer);

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
