FROM node:10.18.0-jessie

# Create and CD app directory
WORKDIR /usr/app 
#
# copy package.json to docker dir 
COPY package.json .

# Install pm2 
RUN npm install pm2 -g

# install npm modules
RUN npm install

# Copy root to docker root
COPY . .
