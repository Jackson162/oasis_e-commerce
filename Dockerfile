# inherit node 10.15.0 Debian (same version as development)
FROM node:10.15.0 as prod
ENV NODE_ENV=production
# server is listening to 3000
ARG PORT=3000
ENV PORT $PORT
EXPOSE 3000
WORKDIR /node
COPY package*.json ./
RUN npm install --only=production && npm cache clean -f

WORKDIR /node/app
COPY . .
CMD ["node", "app.js"]

FROM prod as dev
ENV NODE_ENV=development
RUN npm install --only=development
RUN npm i nodemon mocha -g 
CMD ["nodemon", "-L", "app.js"]


FROM dev as test
ENV NODE_ENV=test
CMD ["npm", "run", "test"]
