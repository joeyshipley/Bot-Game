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
      session.send("Hi %s, you will be playing a %s %s [health: %s/%s] today.",
        session.userData.user.name,
        session.userData.character.charRace.label,
        session.userData.character.charClass.label,
        session.userData.character.hp.current,
        session.userData.character.hp.max);
      session.send("If this is your first time here or has been a while, I recommend that you send me the message: !help (@yelpihs: !help).");
      session.endDialog();
    })
    .catch(function(error) { console.log(error); });
};
module.exports = PlayerCreateDialog;