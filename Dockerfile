# Use Node.js v16.17.1 as the base image
FROM node:18.17.1-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json, package-lock.json and yarn.lock to the working directory
COPY package*.json ./
# Copy the rest of the application to the working directory
COPY . .

# Install the global npm dependencies 
RUN npm install 

WORKDIR /app/client
RUN npm install 

WORKDIR /app/server 
RUN npm install 

WORKDIR /app

RUN npm run build --workspaces

# # Build the client application
# WORKDIR /app/client
# RUN yarn install
# RUN yarn build

# # Build the server application
# WORKDIR /app/server
# RUN npm install
# RUN npm run build

# Set the working directory back to /app
WORKDIR /app/server

# Set the command to start the server application
CMD [ "npm", "run", "start" ]
