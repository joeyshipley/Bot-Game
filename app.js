'use strict';

const _ = require('lodash');
const Botkit = require('botkit');
const builder = require('botbuilder');
const Game = require('./src/game/game.js');
const playerCreateDialog = require('./src/bot/dialogs/playercreate.dialog.js');
const speach = require('./src/bot/yelpihs.speach.js');
const settings = require('./src/config/settings.config.js');
const UTIL = require('./src/infrastructure/util.js');

var _controller = Botkit.slackbot();
var _bot = _controller
  .spawn({ token: process.env.SLACK_TOKEN })
  .startRTM(function(err, bot, payload) {
    if(err) { throw new Error('Could not connect to Slack'); }

    _.forEach(payload.channels, function(channel) {
      if(!channel.is_member) { return; }

      bot.say({
        text: speach.populate(speach.greeting),
        channel: channel.id
      });
      bot.say({
        text: speach.help.fyi,
        channel: channel.id
      });
    });
  });
var _slackbot = new builder.SlackBot(_controller, _bot);
var _game = new Game();

_slackbot.use(function (session, next) {
  if (!session.userData.character) {
    session.beginDialog('/CreatePlayer');
  } else {
    next();
  }
});

_slackbot.add('/', function (session) {});
_slackbot.add('/CreatePlayer', [ function (session) {
  playerCreateDialog(session, _bot, _game.actions.dm.newPlayerCharacter);
} ]);

_controller.hears([ 'play', 'join' ],[ 'direct_message','direct_mention' ],function(bot, message) {
  bot.reply(message, "Ok, let's do this.");
});

_controller.hears([ 'help' ],[ 'direct_message','direct_mention','mention' ],function(bot, message) {
  bot.startConversation(message,function(err,convo) {
    _.forEach(speach.help.defaultConversation, function(message) {
      convo.say(speach.populate(message));
    });
  });
});

_slackbot.listenForMentions();
