mixinsjs = require 'mixinsjs'

{Mixin} = mixinsjs

$w = (s) -> s.split(/\s+/g)

KEYWORDS = $w('biasInSeconds bias time nextTime')
RETURNING_METHODS = $w('finished')

EMPTY_FUNCTION = -> /^function\s*([^(]+\s*)*\([^)]*\)\s*\{\}/gm

STRIP_RE = -> /(^\s*|\s*$)/gm
RETURN_RE = -> /return\s*([^;]+);/
THIS_AND_KEYWORDS_RE = -> ///this\.(#{KEYWORDS.join '|'})///gm
KEYWORDS_RE = ->
  a = KEYWORDS.map (k) -> "#{k}\\s*=\\s*#{k}"
  ///(#{a.join '|'});///gm

Inlinable = (options={}) ->
  class ConcreteInlinable extends Mixin
    sourceFragment: (member) ->
      isConstructor = member is 'constructor'
      source = this[member]

      if isConstructor and options.super
        source = source.__super__.constructor

      source = source.toString()

      # Empty functions and excluded constructor return an empty string
      return '' if EMPTY_FUNCTION().test source
      return '' if isConstructor and options.noconstructor


      # Converts source to array of lines
      asource = source.split('\n')

      # The first and last lines are removed, they contains the signature
      # and the closing brace
      asource.shift()
      asource.pop()

      # Keywords defaults are removed from the source
      if isConstructor
        asource = asource.filter (l) -> not ///#{KEYWORDS.join '|'}///.test l

      # Source casted back as a string
      source = asource.join('\n')

      # Inlined properties handlers
      removeInlinedPropertiesAffectation = (source) =>
        RE = ///this\.(#{options.inlinedProperties.join '|'})\s*=[^\n]+///g
        source.replace RE, ''

      replaceInlinedPropertiesWithValues = (source) =>
        RE = ///this\.(#{options.inlinedProperties.join '|'})///g
        source.replace RE, (m, p) => @[p]

      # Keywords replacement, those keywords will be available as local
      # variable in the resulting code.
      source = source
      .replace(THIS_AND_KEYWORDS_RE(), '$1')
      .replace(KEYWORDS_RE(), '')

      # Inlined properties are replaced by the value defined on the instance
      if options.inlinedProperties?
        source = removeInlinedPropertiesAffectation source
        source = replaceInlinedPropertiesWithValues source

      # If the function is supposed to return a value, the return is
      # replaced with an affectation to a variable with the name of the
      # member
      if member in RETURNING_METHODS
        source = source.replace RETURN_RE(), "#{member} = $1;"
      else
        source = source.replace RETURN_RE(), '$1;'

      source.replace(STRIP_RE(), '')


module.exports = Inlinable