FROM node:lts-slim

# Create app directory
WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

EXPOSE 3000

CMD [ "node", "app.js" ]