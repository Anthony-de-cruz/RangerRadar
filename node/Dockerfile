FROM node:20

WORKDIR /node

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3000

EXPOSE 3000

CMD [ "npm", "run", "start" ]
#CMD ["./wait-for-it.sh", "pms-db:5432", "--", "npm", "run", "start.dev"]
