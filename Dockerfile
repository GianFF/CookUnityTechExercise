FROM node:18-alpine

WORKDIR /CoockUnityTechExercise

COPY package*.json ./

COPY .env-example .env

RUN npm ci --production

COPY . .

CMD [ "npm", "run", "serve" ]
