(function() {
  var BaseAction, Live,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseAction = require('./base_action');

  Live = (function(_super) {

    __extends(Live, _super);

    function Live() {
      return Live.__super__.constructor.apply(this, arguments);
    }

    Live.prototype.process = function(particle) {
      particle.life += this.bias;
      if (particle.life >= particle.maxLife) {
        return particle.die();
      }
    };

    return Live;

  })(BaseAction);

  module.exports = Live;

}).call(this);
