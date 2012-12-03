(function() {
  var BaseAction, MacroAction,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseAction = require('./base_action');

  MacroAction = (function(_super) {

    __extends(MacroAction, _super);

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
