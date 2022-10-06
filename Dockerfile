FROM node:17

WORKDIR /app 
COPY package*.json .
RUN apt-get update
RUN apt-get install -y logrotate
RUN apt-get install -y vim
RUN npm install
COPY . .

CMD npm start
