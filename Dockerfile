FROM node:10.18.0-jessie

# Create and CD app directory
WORKDIR /usr/app 

# Layer creation can be leveraged to to cache portions of an application that rarely change,
# speeding up build times. This caching mechanism can be leveraged in a Node.js app -
# by caching its node_modules directory. By adding the app's package.json and
# running npm install before copying in the app's source files,
# npm install doesn't need to be run after every build

# Install pm2  + typescript
RUN npm install pm2@4.2.1 -g 

# copy package.json to docker dir 
COPY package.json .

# install npm modules + clean npm cache
RUN npm install && npm cache clean

# Copy root to docker root
COPY . .
