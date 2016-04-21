var CharacterSheetDialog = function(session) {

  session.send("%s, you are a level %s %s %s [health: %s/%s]",
    session.userData.user.name,
    session.userData.character.level,
    session.userData.character.charRace.label,
    session.userData.character.charClass.label,
    session.userData.character.hp.current,
    session.userData.character.hp.max);
  session.send("Stats [ Might: %s, Body: %s, Agility: %s, Perception: %s, Intellect: %s, Spirit: %s ]",
    session.userData.character.stats.might,
    session.userData.character.stats.body,
    session.userData.character.stats.agility,
    session.userData.character.stats.perception,
    session.userData.character.stats.intellect,
    session.userData.character.stats.spirit);

  session.endDialog();

};
module.exports = CharacterSheetDialog;