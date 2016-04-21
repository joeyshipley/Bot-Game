const UTIL = require('../infrastructure/util.js');

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
  var self = this;

  self.actions = {
    dm: {
      newPlayerCharacter: dmNewPlayerCharacter
    },
    player: {
      characterAttack: characterAttack
    }
  };

  function dmNewPlayerCharacter() {
    var raceIndex = UTIL.roll(0, PLAYER_RACES.length - 1);
    var charRace = UTIL.copy(PLAYER_RACES[raceIndex]);

    var classIndex = UTIL.roll(0, PLAYER_CLASSES.length - 1);
    var charClass = UTIL.copy(PLAYER_CLASSES[classIndex]);

    return new PlayerCharacter(charRace, charClass);
  }

  function characterAttack(sourceCharacter, targetCharacter) {}
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