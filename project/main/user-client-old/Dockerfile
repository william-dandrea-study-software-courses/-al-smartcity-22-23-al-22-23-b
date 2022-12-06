
###############################
#        PRODUCTION           #
###############################
FROM node:16.16.0-alpine As production

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm config set registry http://registry.npmjs.org/
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]

###############################
#         DEVELOPMENT         #
###############################
FROM node:16.16.0-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./


RUN npm config set registry http://registry.npmjs.org/
RUN npm install --only=development

COPY . .

RUN npm run build
