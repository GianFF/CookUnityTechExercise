### Integration tests suite

This suite is designed to integrate all elements in the application while hitting the API endpoints.
It checks the integration between all elements is working as expected.

DB repositories and Services doing external requests will be supplied by their mock instances, thus that no request will be made to the outside application neither the DB.


TODO: add 2 new scripts to the package.json:
* integration-tests: jest NODE_ENV=development MONGO_CONNECTION_STRING=mongodb://user:pass@127.0.0.1:27017/tracesDB MONGO_CONNECTION_TIMEOUT=1000
* unit-tests: jest NODE_ENV=test
Then remove the `process.env.NODE_ENV = 'test';` on the `statistics.test.js` and `traces.test.js`.
This way we can have two real integration tests.
If that doesn't work then try adding the POSTMAN suite to the Github Actions.