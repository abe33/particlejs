(function() {
  var Impulse, Signal, requestAnimationFrame,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Signal = require('./signal');

  requestAnimationFrame = (typeof window !== "undefined" && window !== null ? window.requestAnimationFrame : void 0) || (typeof window !== "undefined" && window !== null ? window.webkitRequestAnimationFrame : void 0) || (typeof window !== "undefined" && window !== null ? window.mozRequestAnimationFrame : void 0) || (typeof window !== "undefined" && window !== null ? window.oRequestAnimationFrame : void 0) || (typeof window !== "undefined" && window !== null ? window.msRequestAnimationFrame : void 0) || function() {
    return setTimeout(callback, 1000 / 60);
  };

  Impulse = (function(_super) {

    __extends(Impulse, _super);

    Impulse.instance = function() {
      return this._instance || (this._instance = new Impulse);
    };

    function Impulse(timeScale) {
      this.timeScale = timeScale != null ? timeScale : 1;
      Impulse.__super__.constructor.call(this);
      this.running = false;
    }

    Impulse.prototype.add = function(listener, context, priority) {
      if (priority == null) {
        priority = 0;
      }
      Impulse.__super__.add.call(this, listener, context, priority);
      if (this.hasListeners() && !this.running) {
        return this.start();
      }
    };

    Impulse.prototype.remove = function(listener, context, priority) {
      if (priority == null) {
        priority = 0;
      }
      Impulse.__super__.remove.call(this, listener, context, priority);
      if (this.running && !this.hasListeners()) {
        return this.stop();
      }
    };

    Impulse.prototype.hasListeners = function() {
      return this.listeners.length > 0;
    };

    Impulse.prototype.start = function() {
      this.running = true;
      return this.initRun();
    };

    Impulse.prototype.stop = function() {
      return this.running = false;
    };

    Impulse.prototype.initRun = function() {
      var _this = this;
      this.time = this.getTime();
      return requestAnimationFrame(function() {
        return _this.run();
      });
    };

    Impulse.prototype.run = function() {
      var s, t, _ref;
      this.stats != null;
      if (this.running) {
        t = this.getTime();
        s = (t - this.time) * this.timeScale;
        this.dispatch(s, s / 1000, t);
        this.initRun();
      }
      return (_ref = this.stats) != null ? _ref.end() : void 0;
    };

    Impulse.prototype.getTime = function() {
      return new Date().getTime();
    };

    return Impulse;

  })(Signal);

  module.exports = Impulse;

}).call(this);
