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
      "conversion_rate": 1 //Conversion rate from currency to USD
    }
  ],
  "distance_to_usa": 8395.28 // Distance between United States and country of origin (in Kilometers)
}
```

## Architectural Decisions

* Github Actions for CI/CD
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

## API Decisions 

There are 2 endpoints:

* `/statistics`
* `/traces`

Since we expect too many requests per minute some considerations should be taken:

The `traces` endpoint shouldn't calculate all the data each time. The `distance_to_usa` can be calculated only one time and stored in the DB.   
The other elements in the response may change over time, so those would be taken from the response. 

The `statistics` endpoint shouldn't calculate the response each time neither.   
Instead, the `traces` endpoint should do it, storing that data in the DB.   

The "Most traced country" should also be stored in the DB:
* In order to do that I think the best option is to keep an incremental number in the DB for each traced country.
* That way the update should be easy to do and the value easy to query.


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

