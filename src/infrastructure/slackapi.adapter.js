const _ = require('lodash');
const Promise = require('es6-promise').Promise;

var slackApiAdapter = function() {
  return {
    getUsers: getUsers,
    getUser: getUser
  };

  function getUsers(api) {
    return new Promise(function(resolve, reject) {
      api.users.list({}, function (err, res) {
        if(!res.ok) { reject(new Error('Slack API failure in (users.list)')); }

        return resolve(res);
      });
    });
  }

  function getUser(api, userId) {
    return getUsers(api)
      .then(function(res) {
        var user = _.find(res.members, function(u) {
          return u.id && (u.id === userId);
        });
        return user;
      })
      .catch(function(error) { return error; });
  }
};
module.exports = slackApiAdapter();
