(function() {
  var Mixin, Poolable, mixinsjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  mixinsjs = require('mixinsjs');

  Mixin = mixinsjs.Mixin;

  Poolable = (function(_super) {

    __extends(Poolable, _super);

    function Poolable() {
      return Poolable.__super__.constructor.apply(this, arguments);
    }

    Poolable.included = function(klass) {
      klass.resetPools = function() {
        this.allocated = [];
        return this.pooled = [];
      };
      klass.get = function(defaults) {
        var instance, k, v;
        if (defaults == null) {
          defaults = {};
        }
        if (this.pooled.length > 0) {
          instance = this.pooled.shift();
        } else {
          instance = new klass;
        }
        if (typeof instance.init === "function") {
          instance.init();
        }
        for (k in defaults) {
          v = defaults[k];
          instance[k] = v;
        }
        this.allocated.push(instance);
        return instance;
      };
      klass.release = function(instance) {
        var index;
        index = this.allocated.indexOf(instance);
        instance.dispose();
        this.allocated.splice(index, 1);
        return this.pooled.push(instance);
      };
      return klass.resetPools();
    };

    return Poolable;

  })(Mixin);

  module.exports = Poolable;

}).call(this);
