# inherit node 10.15.0 Debian (same version as development)
FROM node:10.15.0 as base
ENV NODE_ENV=production
EXPOSE 3000 9229
WORKDIR /node
COPY package*.json ./
# not install devDependency
RUN npm config list \ 
    && npm ci --only=prod \
    && npm cache clean -f

# do not need to copy code with bind-mount
FROM base as dev
ENV NODE_ENV=development
RUN npm config list
RUN npm install --only=dev
RUN npm i nodemon mocha -g 
CMD ["nodemon", "-L", "app.js"]

FROM dev as test
ENV NODE_ENV=test
COPY . .
CMD ["npm", "run", "test"]
# use to remove undesired files, if you do it in previous image layer, the files
# will still be stored in the old image layer in the image. 
# It just don't show in the latest layer.
FROM test as rm-test
RUN rm -rf ./tests && rm -rf ./node_modules

FROM base as prod
ENV NODE_ENV=production
COPY --from=rm-test /node /node
CMD ["node", "app.js"]
