# CookUnityTechExercise
Technical exercise for CookUnity - Senior backend position.

- [CookUnityTechExercise](#cookunitytechexercise)
  - [Expected solution](#expected-solution)
  - [Architectural Decisions](#architectural-decisions)
  - [API Decisions \& Assumptions](#api-decisions--assumptions)
    - [Assumptions](#assumptions)
    - [Decisions](#decisions)
  - [Dev Dependencies](#dev-dependencies)
  - [Testing](#testing)
  - [API Usage](#api-usage)

## Expected solution

`GET /statistics`

```js
{
  // Longest distance from requested traces
  "longest_distance": {
    "country": "United States",
    "value": 0
  },
  // Most traced country
  "most_traced": { 
    "country": "United States",
    "value": 1
  }
}
```

`POST /traces --> body: {"ip":"167.62.158.169"}`

```js
{
  "ip":"190.191.237.90",
  // Country which issued the IP and its ISO code
  "name": "Argentina", 
  "code": "AR",
  // Coordinates for its location (latitude and longitude)
  "lat": -34.6022,
  "lon": -58.3845,
  // An array of currencies for that country with:
  "currencies": [
    {
      "iso":"ARS", // ISO code (USD, CAD, ARS)
      "symbol": "$", // Symbol ($, £)
      "conversion_rate": 0.023 // Conversion rate from currency to USD
    },
    {
      "iso": "USD", // ISO code (USD, CAD, ARS)
      "symbol": "$", // Symbol ($, £)
      "conversion_rate": 1 // Conversion rate from currency to USD
    }
  ],
  "distance_to_usa": 8395.28 // Distance between United States and country of origin (in Kilometers)
}
```

## Architectural Decisions

* Github Actions for CI/CD running workflos on `main` branch.
  - each commit on `main` will build a new Docker image and push it to the Registry.
  - each commit on every branch will run tests and linter, also integration_tests which are run using POSTMAN and docker-compose. 
  - main branch will be protected, restricting devs to merge a broken PR. Thus that, the CD workflow wont build and push a broken image.
* Jest + Docker and Docker Compose to test the Client API (Integration testing).
* Node JS with Express and vanilla Javascript to build the Client API.
* Jest for testing the Client (Unit testing).
* Eslint to keep code consistency.

There are different options for the Cloud with pros and cons:

* Lambda & API Gateway & DynamoDB.
  - Can use the [AWS Free Tier](https://aws.amazon.com/free/?p=gsrc&c=ho_bswa)
  - Lambda functions can be auto scaled in order to fulfill the demand.
  - Manage the infra as code is something I need to investigate (IAM roles, API Gateway, DynamoDB).

* Kubernetes with Docker & Docker Compose for the MongoDB and the Client API.
  - It is not cost-less to deploy in the Cloud so I would use a local kubernetes container.
  - The solution will need to have different resources like Load Balancer, Ingress, and others to fulfill the demand. Compared with Lambdas, it looks more complex.
  - All the infra can be written in YAML files and managed by devs easily.

* Pricing: 
  - TO BE DONE

* Deploy: 
  - TO BE DONE: I would like to use Kubernetes locally with minikube to showcase the deploy to the cloud.
  - The idea was to update the Manifests Docker image tag on each commit to main, this chould be done on the CD-Workflow Github Action.
  - Once updated, the cluster could take that update and deploy the changes (using some observability mechanism on the manifests repository).

## API Decisions & Assumptions

### Assumptions

Currency exchange can change from request to request.   

### Decisions

The APP will be developped as a monolith application but in a way that would leave the door open to extract different micro-services easily in the future.

`traces` service must calculate the response each request.   
When called, it should delegate in another service the calculation of the "Most traced country". Delegating to another service makes lighter the amount of processing for this service.
The "Distance between United States and country of origin (in Kilometers)" would be calculated using the latitude and longitude provided by the IP Data API.

The `statistics` endpoint must not calculate the response on each request.   
It will only query the DB to get the response.   

The "Most traced country" would be stored in the DB:
* In order to do that I think the best option is to keep an incremental number in the DB for each traced country.
* That way the update should be easy to do and the value easy to query.

The "Longest distance from requested traces" should be also stored in the DB. 

The first trace from each country will be stored in the DB and used as the "Distance to USA".
Another option would be to do an average of all traced IPs from each country to calculate a more accurate distance. To do that, making the `trace.ip` array be an object with IP as key and distance as value would be enough.

## Dev Dependencies

Developing:
* dotenv
* express
* mongodb

Testing:
* jest
* superagent
* supertest

Code styling:
* eslint
* eslint-config-airbnb-base
* eslint-plugin-import

## Testing

Go to: https://github.com/GianFF/CookUnityTechExercise/tree/main/test/integration 

## API Usage

To start up the App in Production mode, execute: `docker compose -f docker-compose.yml up --build`.
Then you can use it from Postman or CURL:
* post /traces --> {ip: 0.0.0.0}
* get /statistics

To statrt Develop mode, execute: `docker compose -f docker-compose.dev.yml up --build`.
Then you can use it from Postman or CURL and made any modifications to the code, it will be reloaded.

To statrt Debug mode, execute: `docker compose -f docker-compose.debug.yml up --build` and then click the Debug button over the `serve` script in the package.json.
Then you can use the application and add breackpoints in the code.