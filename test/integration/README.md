### Integration tests suite

This suite is designed to integrate all elements in the application while hitting the API endpoints.
It checks the integration between all elements is working as expected.

DB repositories and Services doing external requests will be supplied by their mock instances, thus that no request will be made to the outside application neither the DB.