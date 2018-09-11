FROM node

COPY . .

RUN npm install


EXPOSE 3000
EXPOSE 27017

CMD ["node","server.js"]
