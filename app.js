'use strict';

const Promise = require('es6-promise').Promise;
const _ = require('lodash');
const Botkit = require('botkit');
const builder = require('botbuilder');
const controller = Botkit.slackbot();

var _bot = controller.spawn({ token: process.env.SLACK_TOKEN });
var _slackbot = new builder.SlackBot(controller, _bot);

_bot.getChannels = function() {
  let _api = this.api;
  return new Promise(function(resolve, reject) {
    _api.channels.list({'exclude_archived' : 1}, function (err, res) {
      if(!res.ok) { reject(new Error('Slack API failure in (channels.list)')); }

      return resolve(res);
    });
  });
};

_bot.getUsers = function() {
  let _api = this.api;
  return new Promise(function(resolve, reject) {
    _api.users.list({}, function (err, res) {
      if(!res.ok) { reject(new Error('Slack API failure in (users.list)')); }

      return resolve(res);
    });
  });
};

_slackbot.use(function (session, next) {
  if (!session.userData.initialized) {
    session.beginDialog('/InitializeMember');
  } else {
    next();
  }
});
_slackbot.add('/InitializeMember', [
  function (session) {
    _bot
      .getUsers()
      .then(function(res) {
        var members = res.members;
        var member = _.find(members, function(u) {
          return u.id && (u.id === session.userData.id);
        });
        session.userData.member = member;
        session.userData.initialized = true;

        return session;
      })
      .then(function(session) {
        return session.replaceDialog('/');
      })
      .catch(function(err) { console.log(err); });
  }
]);

_slackbot.add('/', function (session) {
  session.send("Hi %s, what can I help you with?", session.userData.member.name);
});

//controller.hears('lunch','direct_message,direct_mention',function(bot, message) {
//  bot.reply(message,"WOOO~ Let's eat!!");
//});

_slackbot.listenForMentions();

_bot.startRTM(function(err, bot, payload) {
  if(err) { throw new Error('Could not connect to Slack'); }

  // ?
});