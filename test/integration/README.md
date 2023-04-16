### Integration tests suite

This suite is designed to integrate all elements in the application while hitting the API endpoints.
It checks the integration between all elements is working as expected.

DB repositories and Services doing external requests will be supplied by their mock instances, thus that no request will be made to the outside application neither the DB.


### Postman integration test suite

This suite lives in Postman and you need to be invited to see it. It is designed to run all tests using the real API and DB, but also all the real components hierarchy.
It would be run on each commit by a Github Action using docker-compose to start up the application and hit the API.

These are the tests on Postman and the Github Action output:

<img width="596" alt="image" src="https://user-images.githubusercontent.com/11510367/232346108-255a63d4-3d3f-4147-8654-e741bc26bc58.png">


<img width="992" alt="image" src="https://user-images.githubusercontent.com/11510367/232346087-78865064-d021-4aaf-a781-3cebdb8dd6a0.png">

<img width="1056" alt="image" src="https://user-images.githubusercontent.com/11510367/232346122-edc402ef-1b53-4dfb-8b91-b034aed3705c.png">

<img width="1065" alt="image" src="https://user-images.githubusercontent.com/11510367/232346128-439b058e-1dfd-472b-b693-8c433b473c9f.png">

