(function() {
  var BaseAction;

  BaseAction = (function() {

    function BaseAction() {}

    BaseAction.prototype.prepare = function(bias, biasInSeconds, time) {
      this.bias = bias;
      this.biasInSeconds = biasInSeconds;
      this.time = time;
    };

    return BaseAction;

  })();

  module.exports = BaseAction;

}).call(this);
