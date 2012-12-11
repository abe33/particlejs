(function() {
  var $w, EMPTY_FUNCTION, Inlinable, KEYWORDS, KEYWORDS_RE, Mixin, RETURNING_METHODS, RETURN_RE, STRIP_RE, THIS_AND_KEYWORDS_RE, mixinsjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  mixinsjs = require('mixinsjs');

  Mixin = mixinsjs.Mixin;

  $w = function(s) {
    return s.split(/\s+/g);
  };

  KEYWORDS = $w('biasInSeconds bias time nextTime');

  RETURNING_METHODS = $w('finished get');

  EMPTY_FUNCTION = function() {
    return /^function\s*([^(]+\s*)*\([^)]*\)\s*\{\}/gm;
  };

  STRIP_RE = function() {
    return /(^\s*|\s*$)/gm;
  };

  RETURN_RE = function() {
    return /return\s*([^;]+);/gm;
  };

  THIS_AND_KEYWORDS_RE = function() {
    return RegExp("this\\.(" + (KEYWORDS.join('|')) + ")", "gm");
  };

  KEYWORDS_RE = function() {
    var a;
    a = KEYWORDS.map(function(k) {
      return "" + k + "\\s*=\\s*" + k;
    });
    return RegExp("(" + (a.join('|')) + ");", "gm");
  };

  Inlinable = function(options) {
    var ConcreteInlinable;
    if (options == null) {
      options = {};
    }
    return ConcreteInlinable = (function(_super) {

      __extends(ConcreteInlinable, _super);

      function ConcreteInlinable() {
        return ConcreteInlinable.__super__.constructor.apply(this, arguments);
      }

      ConcreteInlinable.prototype.sourceFragment = function(member) {
        var RE, asource, isConstructor, k, removeInlinedPropertiesAffectation, replaceInlinedPropertiesWithValues, replacePropertiesWithSource, source, sourceMapped, v, _ref, _ref1,
          _this = this;
        isConstructor = member === 'constructor';
        source = this[member];
        if (isConstructor && options["super"]) {
          source = source.__super__.constructor;
        }
        sourceMapped = false;
        if (((_ref = options.mapSource) != null ? _ref[member] : void 0) != null) {
          if (!(isConstructor && options.mapSource[member] === Object)) {
            source = options.mapSource[member];
            if (typeof source === 'function') {
              source = source.call(this);
            }
            sourceMapped = true;
          }
        }
        if (!sourceMapped) {
          source = source.toString();
          if (EMPTY_FUNCTION().test(source)) {
            return '';
          }
          if (isConstructor && options.noconstructor) {
            return '';
          }
          asource = source.split('\n');
          asource.shift();
          asource.pop();
          if (isConstructor) {
            asource = asource.filter(function(l) {
              return !RegExp("" + (KEYWORDS.join('|'))).test(l);
            });
          }
          source = asource.join('\n');
        }
        removeInlinedPropertiesAffectation = function(source) {
          var RE;
          RE = RegExp("this\\.(" + (options.inlinedProperties.join('|')) + ")\\s*=[^=]+[^\\n]+", "g");
          return source.replace(RE, '');
        };
        replaceInlinedPropertiesWithValues = function(source) {
          var RE;
          RE = RegExp("this\\.(" + (options.inlinedProperties.join('|')) + ")", "g");
          return source.replace(RE, function(m, p) {
            if (_this[p].toSource != null) {
              return _this[p].toSource();
            } else {
              return _this[p];
            }
          });
        };
        replacePropertiesWithSource = function(source) {
          var RE;
          RE = /@([$A-Za-z_][$A-Za-z0-9_]*)/g;
          return source.replace(RE, function(m, p) {
            if (_this[p].toSource != null) {
              return _this[p].toSource();
            } else {
              return _this[p];
            }
          });
        };
        source = source.replace(THIS_AND_KEYWORDS_RE(), '$1').replace(KEYWORDS_RE(), '');
        if (options.keywords != null) {
          RE = RegExp("this\\.(" + (options.keywords.join('|')) + ")", "gm");
          source = source.replace(RE, '$1');
        }
        if (options.inlinedProperties != null) {
          source = removeInlinedPropertiesAffectation(source);
          source = replaceInlinedPropertiesWithValues(source);
        }
        source = replacePropertiesWithSource(source);
        if (options.rename != null) {
          _ref1 = options.rename;
          for (k in _ref1) {
            v = _ref1[k];
            source = source.replace(RegExp("\\b" + k + "\\b", "g"), v);
          }
        }
        if (__indexOf.call(RETURNING_METHODS, member) >= 0) {
          source = source.replace(RETURN_RE(), "" + member + " = $1;");
        } else {
          source = source.replace(RETURN_RE(), '$1;');
        }
        return source.replace(STRIP_RE(), '');
      };

      return ConcreteInlinable;

    })(Mixin);
  };

  module.exports = Inlinable;

}).call(this);
