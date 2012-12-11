(function() {
  var Cloneable, Inlinable, MacroInitializer, Sourcable, include, mapFragments, mixinsjs;

  mixinsjs = require('mixinsjs');

  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  Inlinable = require('../mixins/inlinable');

  mapFragments = function(member) {
    return function() {
      var _this = this;
      return this.initializers.map(function(i) {
        var a, s;
        return s = i.sourceFragment != null ? i.sourceFragment(member) : i[member] === Object ? '' : (a = i[member].toString().split('\n'), a.shift(), a.pop(), a.join('\n'));
      }).join('\n');
    };
  };

  MacroInitializer = (function() {

    include([
      Inlinable({
        mapSource: {
          constructor: function() {
            return mapFragments('constructor').call(this);
          },
          initialize: function() {
            return mapFragments('initialize').call(this);
          }
        }
      }), Cloneable('initializers')
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

    MacroInitializer.prototype.toSource = function() {
      var name, params;
      name = 'particlejs.MacroInitializer';
      params = this.initializers.map(function(initializer) {
        if (initializer.toSource != null) {
          return initializer.toSource();
        } else {
          return initializer;
        }
      });
      return "new " + name + "([" + (params.join(',')) + "])";
    };

    return MacroInitializer;

  })();

  module.exports = MacroInitializer;

}).call(this);
