const SlackApi = require('../../infrastructure/slackapi.adapter.js');

var PlayerCreateDialog = function(session, bot, createCharacter) {
  SlackApi
    .getUser(bot.api, session.userData.id)
    .then(function(user) {
      session.userData.user = { name: user.name };
      return session;
    })
    .then(function(session) {
      session.userData.character = createCharacter();
      return session;
    })
    .then(function(session) {
      session.send("Welcome to my world %s! Without a character your existence would be for not. You are now a %s %s [health: %s/%s].",
        session.userData.user.name,
        session.userData.character.charRace.label,
        session.userData.character.charClass.label,
        session.userData.character.hp.current,
        session.userData.character.hp.max);
      session.send("If you know not the rules of my realm, my suggestion is that you ask for my help.");
      session.endDialog();
    })
    .catch(function(error) { console.log(error); });
};
module.exports = PlayerCreateDialog;