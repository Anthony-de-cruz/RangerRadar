FROM node:20

WORKDIR /node

COPY package*.json ./

RUN npm install

COPY . .

# Default port
ENV PORT 3000
EXPOSE 3000

CMD [ "npm", "run", "start" ]
