FROM node:22-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm install -g typescript

RUN npm install express

RUN tsc

EXPOSE 3000

CMD ["npm", "run", "start"]

