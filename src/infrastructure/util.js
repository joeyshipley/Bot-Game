const _ = require('lodash');

module.exports = {

  copy: function(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  roll: function(startRange, endRange) {
    return _.random(startRange, endRange);
  },

  parse: function(str, match) {
    var args = [].slice.call(arguments, 2);
    var i = 0;

    return str.replace(match, function() {
      return args[i++];
    });
  }
};