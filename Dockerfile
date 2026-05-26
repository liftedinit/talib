# Use Node.js 20 LTS as the base image (required for NestJS 11)
FROM node:20-alpine

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

# Vite bakes VITE_* vars into the client bundle at build time. The default
# matches client/.env so local `docker build` keeps working; CI overrides it
# with the production neighborhood id via --build-arg. A real env var takes
# precedence over the committed .env (see vite loadEnv).
ARG VITE_MFX_NEIGHBORHOOD_ID=1
ENV VITE_MFX_NEIGHBORHOOD_ID=${VITE_MFX_NEIGHBORHOOD_ID}

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
