const { app } = require('./app');
const config = require('./config');
const { mongoClient } = require('./db/mongoClient');

const port = config.PORT || 3003;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Server running on ${config.NODE_ENV} mode`);
  console.log(`Cofiguration ${JSON.stringify(config)}`);
});

/**
 * onAppCrash takes cares of closing MongoDB connections when the app crashes.
 */
function onAppCrash() {
  console.log('App crashed, closing DB connections');
  mongoClient.client.close();
}

process.on('SIGINT', onAppCrash);
process.on('SIGTERM', onAppCrash);
process.on('SIGQUIT', onAppCrash);
