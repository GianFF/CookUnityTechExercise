/* eslint-disable */

// TODO: get from env vars

// Creates Data Base
console.log('\n------- Crating DB -------\n');
const db = db.getSiblingDB('tracesDB');
console.log(`\n------- DB created ${JSON.stringify(db)} -------\n`);

// Create User
console.log(`\n------- Creating User -------\n`);
const user = db.createUser(
  {
    user: 'user',
    pwd:  'pass',
    roles: [ { role: "readWrite", db: "tracesDB" } ]
  }
);
console.log(`\n------- User created ${JSON.stringify(user)} -------\n`);

// Creates Collections
console.log(`\n------- Creating Collection -------\n`);
const collection = db.createCollection('traces');
console.log(`\n------- Collection created ${JSON.stringify(collection)} -------\n`);