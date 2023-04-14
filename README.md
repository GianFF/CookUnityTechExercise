# CookUnityTechExercise
Technical exercise for CookUnity - Senior backend position.

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
  - each commit on every branch will run tests and linter.
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

## API Decisions & Assumptions

### Assumptions:

For the traces response, specifically the "Distance between United States and country of origin (in Kilometers)": it would be calculated using the latitude and longitude provided by the IP Data API, this is because 2 IPs in the same country can have many kilometers of difference.   
Currency exchange can change from request to request.   

### Decisions:

`traces` service must calculate the response each request.   
When called, it should delegate in another service the calculation of the "Most traced country". Delegating to another service makes lighter the amount of processing for this service.


The `statistics` endpoint must not calculate the response on each request.   
It will only query the DB to get the response.   

The "Most traced country" would be stored in the DB:
* In order to do that I think the best option is to keep an incremental number in the DB for each traced country.
* That way the update should be easy to do and the value easy to query.

The "Longest distance from requested traces" should be also stored in the DB.

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

### API Usage

To start up the App in Production mode, execute: `docker compose -f docker-compose.yml up --build`.
Then you can use it from Postman or CURL:
* post /traces --> {ip: 0.0.0.0}
* get /statistics

To statrt Develop mode, execute: `docker compose -f docker-compose.dev.yml up --build`.
Then you can use it from Postman or CURL and made any modifications to the code, it will be reloaded.