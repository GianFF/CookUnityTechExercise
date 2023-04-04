const { app } = require('./app');
const { mongoClient } = require('./db/mongoClient');

const port = 3003;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
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
