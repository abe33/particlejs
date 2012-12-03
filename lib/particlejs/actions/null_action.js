(function() {
  var NullAction;

  NullAction = (function() {

    function NullAction() {}

    NullAction.prototype.prepare = function() {};

    NullAction.prototype.process = function() {};

    return NullAction;

  })();

  module.exports = NullAction;

}).call(this);
