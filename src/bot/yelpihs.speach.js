const UTIL = require('../infrastructure/util.js');
const settings = require('../config/settings.config.js');

module.exports = {
  greeting: 'I %bot_name, have arrived. We are now in session.',
  help: {
    fyi: 'Remember, you can always ask me for \'help\'',
    defaultConversation: [
      'I am refreshed by your interest in learning my game. So here\'s the deal, a well known secret of mine if you will...',
      'I do love to watch my players fail in their Adventures and Quests. Though most people want to just stair at their Character\'s Sheet.',
      'It matters not though, for I am %bot_name, your Dungeon Master extraordinaire!'
    ]
  },
  populate: function(string) {
    var result = UTIL.copy(string);
    result = UTIL.parse(result, /%bot_name/g, settings.BOT_NAME);
    return result;
  }
};