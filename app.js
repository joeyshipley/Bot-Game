'use strict';

const Promise = require('es6-promise').Promise;
const _ = require('lodash');
const Botkit = require('botkit');
const builder = require('botbuilder');
const controller = Botkit.slackbot();

var _bot = controller.spawn({ token: process.env.SLACK_TOKEN });
var _slackbot = new builder.SlackBot(controller, _bot);

var Character = function() {
  this.name = '';
  this.charRace = {};
  this.charClass = {};
  this.level = 1;
  this.hp = {
    max: 10,
    current: 10
  };
  this.stats = {
    might: 10,
    body: 10,
    agility: 10,
    perception: 10,
    intellect: 10,
    spirit: 10
  };
};

var _tempBoss = new Character();
_tempBoss.name = 'Orc Brute';
_tempBoss.level = 7;
_tempBoss.hp.max = 210;
_tempBoss.hp.current = 210;
_tempBoss.stats.might = 35;
_tempBoss.stats.body = 35;
_tempBoss.stats.agility = 20;
_tempBoss.stats.perception = 20;
_tempBoss.stats.intellect = 10;
_tempBoss.stats.spirit = 15;

var _game = {
  boss: _tempBoss,
  playerRacesKey: [ 'human', 'elf', 'dwarf'],
  playerRaces: {
    human: { label: 'Human', might: 5, body: 5, agility: 5, perception: 5, intellect: 5, spirit: 5 },
    elf: { label: 'Elf', might: 0, body: -5, agility: 10, perception: 10, intellect: 5, spirit: 10 },
    dwarf: { label: 'Dwarf', might: 10, body: 10, agility: -5, perception: 5, intellect: 0, spirit: 10 }
  },
  playerClassesKey: [ 'warrior', 'rogue', 'magi'],
  playerClasses: {
    warrior: { label: 'Warrior', might: 10, body: 10, agility: 5, perception: 5, intellect: 0, spirit: 0 },
    rogue: { label: 'Rogue', might: 5, body: 0, agility: 10, perception: 10, intellect: 0, spirit: 5 },
    magi: { label: 'Magi', might: 0, body: 0, agility: 5, perception: 5, intellect: 10, spirit: 10 }
  },
  actions: {
    dm: {
      newPlayerCharacter: function() {
        var raceKeyIndex = _game.util.roll(0, _game.playerRacesKey.length - 1);
        var raceKey = _game.playerRacesKey[raceKeyIndex];
        var race = _game.playerRaces[raceKey];
        var charRace = _game.util.copy(race);
        var classKeyIndex = _game.util.roll(0, _game.playerClassesKey.length - 1);
        var classKey = _game.playerClassesKey[classKeyIndex];
        var charClass = _game.util.copy(_game.playerClasses[classKey]);
        var character = new Character();
        character.name = 'Unnamed Character';
        character.level = 1;
        character.charRace = charRace;
        character.charClass = charClass;
        character.stats.might += charRace.might + charClass.might;
        character.stats.body += charRace.body + charClass.body;
        character.stats.agility += charRace.agility + charClass.agility;
        character.stats.perception += charRace.perception + charClass.perception;
        character.stats.intellect += charRace.intellect + charClass.intellect;
        character.stats.spirit += charRace.spirit + charClass.spirit;
        character.hp.max += (character.stats.body * 2);
        character.hp.current += (character.stats.body * 2);

        return character;
      }
    },
    character: {
      attack: function(sourceCharacter, targetCharacter) {

      }
    }
  },
  util: {
    roll: function(startRange, endRange) {
      return _.random(startRange, endRange);
    },
    copy: function(obj) {
      return JSON.parse(JSON.stringify(obj));
    }
  }
};




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