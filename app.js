'use strict';

const Botkit = require('botkit');
const playerCreateDialog = require('./src/bot/dialogs/playercreate.dialog.js');
const Game = require('./src/game/game.js');
const builder = require('botbuilder');
const controller = Botkit.slackbot();

var _bot = controller.spawn({ token: process.env.SLACK_TOKEN });
var _slackbot = new builder.SlackBot(controller, _bot);
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

controller.hears([ 'play', 'join' ],[ 'direct_message','direct_mention' ],function(bot,message) {
  bot.reply(message, "Ok, let's do this.");
});

controller.hears([ 'help' ],[ 'direct_message','direct_mention','mention' ],function(bot,message) {
  bot.reply(message, "Sorry, there is nothing you can do in this game yet. You can thank the maker for that...");
});

// TODO: explore bot startup message.

_slackbot.listenForMentions();

_bot.startRTM(function(err, bot, payload) {
  if(err) { throw new Error('Could not connect to Slack'); }

  // ?
});