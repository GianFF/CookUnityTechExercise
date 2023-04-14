/* eslint-disable */

// Creates Data Base
// TODO: get from env vars
db = db.getSiblingDB('tracesDB');

// Creates Collections
db.createCollection('traces');