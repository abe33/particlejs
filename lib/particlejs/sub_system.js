(function() {
  var SubSystem, System,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  System = require('./system');

  SubSystem = (function(_super) {

    __extends(SubSystem, _super);

    function SubSystem(initializer, action, emissionFactory, subSystem) {
      this.emissionFactory = emissionFactory;
      SubSystem.__super__.constructor.call(this, initializer, action, subSystem);
    }

    SubSystem.prototype.emitFor = function(particle) {
      return this.emit(this.emissionFactory(particle));
    };

    return SubSystem;

  })(System);

  module.exports = SubSystem;

}).call(this);
