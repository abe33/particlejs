(function() {
  var BaseAction, Cloneable, Inlinable, MacroAction, Sourcable, include, mapFragments, mixinsjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  mixinsjs = require('mixinsjs');

  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  Inlinable = require('../mixins/inlinable');

  BaseAction = require('./base_action');

  mapFragments = function(member) {
    return function() {
      var _this = this;
      return this.actions.map(function(i) {
        var a, s;
        return s = i.sourceFragment != null ? i.sourceFragment(member) : i[member] === Object ? '' : (a = i[member].toString().split('\n'), a.shift(), a.pop(), a.join('\n'));
      }).join('\n');
    };
  };

  MacroAction = (function(_super) {

    __extends(MacroAction, _super);

    include([
      Inlinable({
        mapSource: {
          constructor: function() {
            return mapFragments('constructor').call(this);
          },
          prepare: function() {
            return mapFragments('prepare').call(this);
          },
          process: function() {
            return mapFragments('process').call(this);
          }
        }
      }), Cloneable('actions'), Sourcable('particlejs.MacroAction', 'actions')
    ])["in"](MacroAction);

    function MacroAction(actions) {
      this.actions = actions != null ? actions : [];
    }

    MacroAction.prototype.prepare = function(bias, biasInSeconds, time) {
      var action, _i, _len, _ref, _results;
      _ref = this.actions;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        action = _ref[_i];
        _results.push(action.prepare(bias, biasInSeconds, time));
      }
      return _results;
    };

    MacroAction.prototype.process = function(particle) {
      var action, _i, _len, _ref, _results;
      _ref = this.actions;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        action = _ref[_i];
        _results.push(action.process(particle));
      }
      return _results;
    };

    return MacroAction;

  })(BaseAction);

  module.exports = MacroAction;

}).call(this);
