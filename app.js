'use strict';

const Botkit = require('botkit');
const SlackApi = require('./src/bot/slackapi.adapter.js');
const Game = require('./src/game/game.js');
const builder = require('botbuilder');
const controller = Botkit.slackbot();

var _bot = controller.spawn({ token: process.env.SLACK_TOKEN });
var _slackbot = new builder.SlackBot(controller, _bot);
var _game = new Game();

_slackbot.use(function (session, next) {
  if (!session.userData.initialized) {
    session.beginDialog('/InitializeMember');
  } else {
    next();
  }
});
_slackbot.add('/InitializeMember', [
  function (session) {
    SlackApi
      .getUser(_bot.api, session.userData.id)
      .then(function(user) {
        session.userData.user = { name: user.name };
        return session;
      })
      .then(function(session) {
        session.userData.character = _game.actions.dm.newPlayerCharacter();
        return session;
      })
      .then(function(session) {
        session.userData.initialized = true;
        return session.replaceDialog('/');
      })
      .catch(function(error) { console.log(error); });
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