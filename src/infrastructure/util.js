const _ = require('lodash');

module.exports = {

  copy: function(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  roll: function(startRange, endRange) {
    return _.random(startRange, endRange);
  }
  
};