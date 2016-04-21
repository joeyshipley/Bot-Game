const _ = require('lodash');
const Warrior = require('./playerclasses/warrior.class.js');
const Rogue = require('./playerclasses/rogue.class.js');
const Magi = require('./playerclasses/magi.class.js');
const Human = require('./playerraces/human.race.js');
const Dwarf = require('./playerraces/dwarf.race.js');
const Elf = require('./playerraces/elf.race.js');
const PlayerCharacter = require('./character.js');

const PLAYER_RACES = [ Human, Dwarf, Elf];
const PLAYER_CLASSES = [ Warrior, Rogue, Magi ];

var Game = function() {
  this.actions = {
    dm: {
      newPlayerCharacter: dmNewPlayerCharacter
    },
    player: {
      characterAttack: characterAttack
    }
  };

  function dmNewPlayerCharacter() {
    var raceKeyIndex = roll(0, PLAYER_RACES.length - 1);
    var charRace = copy(PLAYER_RACES[raceKeyIndex]);

    var classKeyIndex = roll(0, PLAYER_CLASSES.length - 1);
    var charClass = copy(PLAYER_CLASSES[classKeyIndex]);

    return new PlayerCharacter(charRace, charClass);
  }

  function characterAttack(sourceCharacter, targetCharacter) {}

  function roll(startRange, endRange) {
    return _.random(startRange, endRange);
  }

  function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
};
module.exports = Game;



// var _tempBoss = new Character();
// _tempBoss.name = 'Orc Brute';
// _tempBoss.level = 7;
// _tempBoss.hp.max = 210;
// _tempBoss.hp.current = 210;
// _tempBoss.stats.might = 35;
// _tempBoss.stats.body = 35;
// _tempBoss.stats.agility = 20;
// _tempBoss.stats.perception = 20;
// _tempBoss.stats.intellect = 10;
// _tempBoss.stats.spirit = 15;