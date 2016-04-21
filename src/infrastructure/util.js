const _ = require('lodash');

module.exports = {

  copy: function(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  roll: function(startRange, endRange) {
    return _.random(startRange, endRange);
  },

  parse: function(str) {
    var args = [].slice.call(arguments, 1);
    var i = 0;

    return str.replace(/%s/g, function() {
      return args[i++];
    });
  }
};