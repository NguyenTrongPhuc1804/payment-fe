FROM node:22-alpine

WORKDIR /payment/FE

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm","run","dev","--","--host"]