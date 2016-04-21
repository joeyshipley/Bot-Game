'use strict';

const _ = require('lodash');
const Promise = require('es6-promise').Promise;
const Botkit = require('botkit');
const Game = require('./src/game.js');
const builder = require('botbuilder');
const controller = Botkit.slackbot();

var _bot = controller.spawn({ token: process.env.SLACK_TOKEN });
var _slackbot = new builder.SlackBot(controller, _bot);
var _game = new Game();

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

_bot.getUser = function(id) {
  let _api = this.api;
  return new Promise(function(resolve, reject) {

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
        var users = res.members;
        var user = _.find(users, function(u) {
          return u.id && (u.id === session.userData.id);
        });
        session.userData.user = { name: user.name };

        return session;
      })
      .then(function(session) {
        var character = _game.actions.dm.newPlayerCharacter();
        session.userData.character = character;
        return session;
      })
      .then(function(session) {
        session.userData.initialized = true;
        return session.replaceDialog('/');
      })
      .catch(function(err) { console.log(err); });
  }
]);

_slackbot.add('/', function (session) {
  session.send("Hi %s, you will be playing a %s %s [health: %s/%s] today.",
    session.userData.user.name,
    session.userData.character.charRace.label,
    session.userData.character.charClass.label,
    session.userData.character.hp.current,
    session.userData.character.hp.max);
  session.send("If this is your first time here or has been a while, I recommend that you send me the message: !help (@yelpihs: !help).");
});

controller.hears(['!help'],['direct_message','direct_mention','mention'],function(bot,message) {
  bot.reply(message, "Sorry, there is nothing you can do in this game yet. You can thank the maker for that...");
});

// TODO: explore bot startup message.

_slackbot.listenForMentions();

_bot.startRTM(function(err, bot, payload) {
  if(err) { throw new Error('Could not connect to Slack'); }

  // ?
});