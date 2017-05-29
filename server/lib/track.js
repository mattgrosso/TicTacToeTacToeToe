const ua = require('universal-analytics');

module.exports = function track(playerID, category, eventName){
  const visitor = ua(process.env.GOOGLE_ANALYTICS_ID, playerID);
  visitor.event(category, eventName).send();
}
