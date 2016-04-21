const DEFAULT_STATS = {
  might: 10,
  body: 10,
  agility: 10,
  perception: 10,
  intellect: 10,
  spirit: 10
};
const DEFAULT_HP = {
  max: 10,
  current: 10
};

var Character = function(charRace, charClass) {
  var self = this;

  self.name = 'Unnamed Character';
  self.charRace = charRace;
  self.charClass = charClass;
  self.level = 1;

  self.stats = buildStats(charRace, charClass);
  self.hp = buildHp(self.stats);

  function buildStats(charRace, charClass) {
    return {
      might: DEFAULT_STATS.might + charRace.might + charClass.might,
      body: DEFAULT_STATS.body + charRace.body + charClass.body,
      agility: DEFAULT_STATS.agility + charRace.agility + charClass.agility,
      perception: DEFAULT_STATS.perception + charRace.perception + charClass.perception,
      intellect: DEFAULT_STATS.intellect + charRace.intellect + charClass.intellect,
      spirit: DEFAULT_STATS.spirit + charRace.spirit + charClass.spirit
    }
  }

  function buildHp(stats) {
    return {
      max: DEFAULT_HP.max + (stats.body * 2),
      current: DEFAULT_HP.current + (stats.body * 2)
    }
  }
};
module.exports = Character;

